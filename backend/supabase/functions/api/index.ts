// Kasi24 trusted workflows. Runs with a direct DB connection (private schema is not
// exposed to the Data API). Every route verifies the caller's JWT, account status and
// role/ownership in code before touching data. Never log addresses or document paths.
import postgres from "npm:postgres@3.4.5";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { max: 3, prepare: false });
const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
  auth: { persistSession: false },
});

const CORS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KINDS = ["backyard_room", "shack", "room_in_house", "other"];

class HttpError extends Error {
  constructor(public status: number, msg: string) { super(msg); }
}
const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// ---------- validation helpers ----------
const str = (v: unknown, min: number, max: number, name: string): string => {
  if (typeof v !== "string" || v.trim().length < min || v.trim().length > max)
    throw new HttpError(400, `${name} must be text of ${min}-${max} characters`);
  return v.trim();
};
const optStr = (v: unknown, max: number, name: string) => (v == null || v === "" ? null : str(v, 1, max, name));
const num = (v: unknown, min: number, max: number, name: string): number => {
  if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max)
    throw new HttpError(400, `${name} must be a number between ${min} and ${max}`);
  return v;
};
const optNum = (v: unknown, min: number, max: number, name: string) => (v == null ? null : num(v, min, max, name));
const uuid = (v: unknown, name: string): string => {
  if (typeof v !== "string" || !UUID.test(v)) throw new HttpError(400, `${name} must be a valid id`);
  return v;
};
// Uploaded files must live under the caller's own folder (storage policy convention).
const ownPath = (v: unknown, uid: string, name: string): string => {
  const p = str(v, 3, 300, name);
  if (!p.startsWith(uid + "/") || p.includes("..")) throw new HttpError(400, `${name} must be inside your own upload folder`);
  return p;
};

// ---------- auth + transaction ----------
async function authenticate(req: Request): Promise<string> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) throw new HttpError(401, "Missing bearer token");
  const { data, error } = await supa.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, "Invalid or expired token");
  return data.user.id;
}

// deno-lint-ignore no-explicit-any
type Q = any;

async function tx<T>(uid: string, fn: (q: Q) => Promise<T>): Promise<T> {
  // deno-lint-ignore no-explicit-any
  return await sql.begin(async (q: any) => {
    // Lets DB triggers record auth.uid() as the actor.
    await q`select set_config('request.jwt.claims', ${JSON.stringify({ sub: uid, role: "authenticated" })}, true)`;
    const [p] = await q`select account_status from public.profiles where id = ${uid}`;
    if (!p || p.account_status !== "active") throw new HttpError(403, "Account is not active");
    return await fn(q);
  }) as T;
}

async function requireStaff(q: Q, uid: string) {
  const r = await q`select 1 from private.user_roles where user_id = ${uid} and role::text = any(${q.array(["moderator", "admin"], "text")})`;
  if (!r.length) throw new HttpError(403, "Moderator or admin role required");
}

async function audit(q: Q, uid: string, eventType: string, entityType: string, entityId: string, oldV?: unknown, newV?: unknown) {
  await q`insert into private.audit_events (actor_id, event_type, entity_type, entity_id, old_value, new_value)
           values (${uid}, ${eventType}, ${entityType}, ${entityId},
                   ${oldV ? JSON.stringify(oldV) : null}::jsonb, ${newV ? JSON.stringify(newV) : null}::jsonb)`;
}

// ---------- handlers ----------
async function onboardProvider(uid: string, b: Record<string, unknown>) {
  const display = str(b.display_name, 1, 120, "display_name");
  const business = optStr(b.business_name, 120, "business_name");
  const bio = optStr(b.public_bio, 1000, "public_bio");
  const legal = optStr(b.legal_name, 200, "legal_name");
  const docType = optStr(b.document_type, 60, "document_type");
  const docPath = b.identity_document_path ? ownPath(b.identity_document_path, uid, "identity_document_path") : null;
  return await tx(uid, async (q) => {
    if ((await q`select 1 from public.providers where user_id = ${uid}`).length)
      throw new HttpError(409, "Provider profile already exists");
    const [prov] = await q`insert into public.providers (user_id, display_name, business_name, public_bio)
      values (${uid}, ${display}, ${business}, ${bio}) returning id, verification_status`;
    await q`insert into private.provider_identity (provider_id, legal_name, identity_document_path, document_type)
      values (${prov.id}, ${legal}, ${docPath}, ${docType})`;
    await q`insert into private.user_roles (user_id, role) values (${uid}, 'provider') on conflict do nothing`;
    await audit(q, uid, "provider.onboarded", "provider", prov.id);
    return { provider: prov };
  });
}

async function createListing(uid: string, b: Record<string, unknown>) {
  const areaId = uuid(b.area_id, "area_id");
  if (typeof b.kind !== "string" || !KINDS.includes(b.kind)) throw new HttpError(400, `kind must be one of ${KINDS.join(", ")}`);
  const title = str(b.title, 3, 120, "title");
  const description = str(b.description, 1, 4000, "description");
  const rent = num(b.monthly_rent_zar, 0, 100000, "monthly_rent_zar");
  const deposit = optNum(b.deposit_zar, 0, 100000, "deposit_zar");
  const occupants = optNum(b.max_occupants, 1, 50, "max_occupants");
  if (occupants !== null && !Number.isInteger(occupants)) throw new HttpError(400, "max_occupants must be a whole number");
  const availableFrom = b.available_from == null ? null : str(b.available_from, 10, 10, "available_from");
  if (availableFrom && !/^\d{4}-\d{2}-\d{2}$/.test(availableFrom)) throw new HttpError(400, "available_from must be YYYY-MM-DD");
  const codes = Array.isArray(b.amenity_codes) ? b.amenity_codes.slice(0, 30).map((c) => str(c, 1, 50, "amenity_code")) : [];
  const a = (b.address ?? {}) as Record<string, unknown>;
  const addr = {
    unit: optStr(a.building_or_unit, 200, "address.building_or_unit"),
    locality: optStr(a.locality_description, 500, "address.locality_description"),
    lat: optNum(a.exact_latitude, -90, 90, "address.exact_latitude"),
    lng: optNum(a.exact_longitude, -180, 180, "address.exact_longitude"),
    directions: optStr(a.directions, 1000, "address.directions"),
  };
  const evidence = Array.isArray(b.evidence) ? b.evidence.slice(0, 10).map((e: Record<string, unknown>) => ({
    type: str(e?.evidence_type, 1, 60, "evidence_type"),
    path: ownPath(e?.object_path, uid, "object_path"),
  })) : [];
  return await tx(uid, async (q) => {
    const [prov] = await q`select id from public.providers where user_id = ${uid}`;
    if (!prov) throw new HttpError(403, "Complete provider onboarding first");
    if (!(await q`select 1 from public.areas where id = ${areaId} and is_active`).length) throw new HttpError(400, "Unknown or inactive area");
    const [l] = await q`insert into public.listings (provider_id, area_id, kind, title, description, monthly_rent_zar, deposit_zar, max_occupants, available_from)
      values (${prov.id}, ${areaId}, ${b.kind as string}, ${title}, ${description}, ${rent}, ${deposit}, ${occupants}, ${availableFrom}) returning id, status`;
    await q`insert into private.listing_addresses (listing_id, building_or_unit, locality_description, exact_latitude, exact_longitude, directions)
      values (${l.id}, ${addr.unit}, ${addr.locality}, ${addr.lat}, ${addr.lng}, ${addr.directions})`;
    if (codes.length)
      await q`insert into public.listing_amenities (listing_id, amenity_id)
        select ${l.id}, id from public.amenities where active and code = any(${q.array(codes, "text")})`;
    for (const e of evidence)
      await q`insert into private.listing_evidence (listing_id, evidence_type, object_path) values (${l.id}, ${e.type}, ${e.path})`;
    await audit(q, uid, "listing.created", "listing", l.id);
    return { listing: l };
  });
}

async function submitListing(uid: string, listingId: string) {
  return await tx(uid, async (q) => {
    const [l] = await q`select l.id, l.status from public.listings l join public.providers p on p.id = l.provider_id
      where l.id = ${listingId} and p.user_id = ${uid} for update of l`;
    if (!l) throw new HttpError(404, "Listing not found");
    if (!["draft", "rejected"].includes(l.status)) throw new HttpError(409, `Listing is ${l.status} and cannot be submitted`);
    if (!(await q`select 1 from private.listing_addresses where listing_id = ${listingId}`).length) throw new HttpError(422, "Listing needs an address");
    if (!(await q`select 1 from private.listing_evidence where listing_id = ${listingId} and status in ('pending','approved')`).length)
      throw new HttpError(422, "Upload authority-to-let evidence before submitting");
    await q`update public.listings set status = 'pending_review' where id = ${listingId}`;
    await audit(q, uid, "listing.submitted", "listing", listingId, { status: l.status }, { status: "pending_review" });
    await q`insert into private.outbox_events (event_type, entity_id, payload) values ('listing.submitted', ${listingId}, '{}'::jsonb)`;
    return { listing: { id: listingId, status: "pending_review" } };
  });
}

async function reviewListing(uid: string, listingId: string, b: Record<string, unknown>) {
  const decision = b.decision;
  if (decision !== "approve" && decision !== "reject") throw new HttpError(400, "decision must be approve or reject");
  const reason = str(b.reason, 3, 500, "reason");
  return await tx(uid, async (q) => {
    await requireStaff(q, uid);
    const [l] = await q`select l.id, l.status, p.user_id as owner_id, p.verification_status
      from public.listings l join public.providers p on p.id = l.provider_id where l.id = ${listingId} for update of l`;
    if (!l) throw new HttpError(404, "Listing not found");
    if (l.owner_id === uid) throw new HttpError(403, "You cannot review your own listing");
    if (l.status !== "pending_review") throw new HttpError(409, `Listing is ${l.status}, not pending review`);
    if (decision === "approve") {
      if (l.verification_status !== "approved") throw new HttpError(422, "Provider is not verified");
      if (!(await q`select 1 from private.listing_evidence where listing_id = ${listingId} and evidence_type = 'authority_to_let' and status = 'approved'`).length)
        throw new HttpError(422, "Approved authority-to-let evidence is required");
      await q`update public.listings set status = 'approved', approved_at = now(), approved_by = ${uid}, published_at = now(),
        last_availability_confirmed_at = now() where id = ${listingId}`;
    } else {
      await q`update public.listings set status = 'rejected' where id = ${listingId}`;
    }
    const newStatus = decision === "approve" ? "approved" : "rejected";
    await q`insert into private.moderation_actions (listing_id, actor_id, action, reason) values (${listingId}, ${uid}, ${decision}, ${reason})`;
    await audit(q, uid, "listing.reviewed", "listing", listingId, { status: l.status }, { status: newStatus });
    await q`insert into private.outbox_events (event_type, entity_id, payload) values ('listing.reviewed', ${listingId}, ${JSON.stringify({ decision })}::jsonb)`;
    return { listing: { id: listingId, status: newStatus } };
  });
}

async function reviewEvidence(uid: string, evidenceId: string, b: Record<string, unknown>) {
  const decision = b.decision;
  if (decision !== "approve" && decision !== "reject") throw new HttpError(400, "decision must be approve or reject");
  const notes = optStr(b.notes, 500, "notes");
  return await tx(uid, async (q) => {
    await requireStaff(q, uid);
    const [e] = await q`select e.id, e.status, p.user_id as owner_id from private.listing_evidence e
      join public.listings l on l.id = e.listing_id join public.providers p on p.id = l.provider_id where e.id = ${evidenceId} for update of e`;
    if (!e) throw new HttpError(404, "Evidence not found");
    if (e.owner_id === uid) throw new HttpError(403, "You cannot review your own evidence");
    if (e.status !== "pending") throw new HttpError(409, `Evidence is already ${e.status}`);
    const status = decision === "approve" ? "approved" : "rejected";
    await q`update private.listing_evidence set status = ${status}::public.evidence_state, reviewer_id = ${uid}, reviewed_at = now(), review_notes = ${notes} where id = ${evidenceId}`;
    await audit(q, uid, "evidence.reviewed", "listing_evidence", evidenceId, { status: e.status }, { status });
    return { evidence: { id: evidenceId, status } };
  });
}

async function reviewProvider(uid: string, providerId: string, b: Record<string, unknown>) {
  const decision = b.decision;
  if (decision !== "approve" && decision !== "reject") throw new HttpError(400, "decision must be approve or reject");
  const notes = optStr(b.notes, 500, "notes");
  return await tx(uid, async (q) => {
    await requireStaff(q, uid);
    const [p] = await q`select id, user_id, verification_status from public.providers where id = ${providerId} for update`;
    if (!p) throw new HttpError(404, "Provider not found");
    if (p.user_id === uid) throw new HttpError(403, "You cannot verify yourself");
    const status = decision === "approve" ? "approved" : "rejected";
    await q`update public.providers set verification_status = ${status}::public.evidence_state where id = ${providerId}`;
    await q`update private.provider_identity set reviewed_by = ${uid}, reviewed_at = now(), verification_notes = ${notes} where provider_id = ${providerId}`;
    await audit(q, uid, "provider.reviewed", "provider", providerId, { status: p.verification_status }, { status });
    return { provider: { id: providerId, verification_status: status } };
  });
}

// ---------- router ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  try {
    if (req.method !== "POST") throw new HttpError(405, "Use POST");
    const parts = new URL(req.url).pathname.split("/").filter(Boolean);
    const route = parts.slice(parts.indexOf("api") + 1);
    const uid = await authenticate(req);
    const body = await req.json().catch(() => ({}));
    if (typeof body !== "object" || body === null || Array.isArray(body)) throw new HttpError(400, "JSON object body required");
    const b = body as Record<string, unknown>;
    const [a, id, c] = route;

    if (a === "provider" && id === "onboard" && !c) return reply(200, await onboardProvider(uid, b));
    if (a === "listings" && !id) return reply(201, await createListing(uid, b));
    if (a === "listings" && id && c === "submit") return reply(200, await submitListing(uid, uuid(id, "listing id")));
    if (a === "listings" && id && c === "review") return reply(200, await reviewListing(uid, uuid(id, "listing id"), b));
    if (a === "evidence" && id && c === "review") return reply(200, await reviewEvidence(uid, uuid(id, "evidence id"), b));
    if (a === "providers" && id && c === "review") return reply(200, await reviewProvider(uid, uuid(id, "provider id"), b));
    throw new HttpError(404, "Unknown route");
  } catch (e) {
    if (e instanceof HttpError) return reply(e.status, { error: e.message });
    const code = (e as { code?: string })?.code;
    console.error("api error", code, (e as Error)?.message);
    if (code === "23505") return reply(409, { error: "Conflict: record already exists" });
    if (code === "23514" || code === "23503") return reply(400, { error: "Invalid data" });
    return reply(500, { error: "Internal error" });
  }
});
