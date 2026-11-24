import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRand } from '../components/listings/ListingCard';
import { kindLabel } from '../services/listingService';
import {
  getMyListings,
  getMyProvider,
  listingStatusLabel,
  onboardProvider,
  submitListing,
  uploadVerificationFile,
} from '../services/providerService';

const DOCUMENT_TYPES = ['South African ID', 'Passport', "Driver's licence"];

function OnboardingForm({ userId, onDone }) {
  const [form, setForm] = useState({ display_name: '', business_name: '', public_bio: '', legal_name: '', document_type: DOCUMENT_TYPES[0] });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const identity_document_path = await uploadVerificationFile(userId, file);
      await onboardProvider({
        ...form,
        business_name: form.business_name.trim() || null,
        public_bio: form.public_bio.trim() || null,
        identity_document_path,
      });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card form-card">
      <h1>Become a provider</h1>
      <p>Tell us about you. Our team checks your identity before your listings can go live. Your ID document is private and is never shown to customers.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>Name shown to customers
          <input value={form.display_name} onChange={set('display_name')} maxLength={120} required />
        </label>
        <label>Business name (optional)
          <input value={form.business_name} onChange={set('business_name')} maxLength={120} />
        </label>
        <label>About you (optional)
          <textarea value={form.public_bio} onChange={set('public_bio')} maxLength={1000} rows={3} />
        </label>
        <label>Full legal name
          <input value={form.legal_name} onChange={set('legal_name')} maxLength={200} required />
        </label>
        <label>Identity document type
          <select value={form.document_type} onChange={set('document_type')}>
            {DOCUMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Identity document (JPG, PNG or PDF, max 10 MB)
          <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        </label>
        {error && <p role="alert" className="form__error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? 'Submitting...' : 'Submit for verification'}</button>
      </form>
    </section>
  );
}

// Provider dashboard. Needs login (see routes). Shows onboarding first, then the provider's own listings.
export default function ProviderPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [provider, setProvider] = useState(undefined); // undefined = loading, null = not onboarded
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const p = await getMyProvider(user.id);
      setProvider(p);
      setListings(p ? await getMyListings(p.id) : []);
    } catch (err) {
      setError(err.message);
      setProvider(null);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(listingId) {
    setError('');
    setBusyId(listingId);
    try {
      await submitListing(listingId);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (provider === undefined) return <p role="status">Loading...</p>;
  if (provider === null) return <OnboardingForm userId={user.id} onDone={load} />;

  const verified = provider.verification_status === 'approved';

  return (
    <section>
      <h1>Your listings</h1>
      <p>
        {provider.business_name || provider.display_name}{' '}
        <span className="badge">{verified ? 'Verified' : provider.verification_status === 'rejected' ? 'Verification rejected' : 'Verification pending'}</span>
      </p>
      {!verified && <p className="muted">Your listings can be submitted now, but they only go live once your identity check is approved.</p>}
      {location.state?.created && <p role="status" className="form__notice">Listing saved as a draft. Submit it for review when you are ready.</p>}
      {error && <p role="alert" className="form__error">{error}</p>}

      <Link to="/provider/listings/new" className="btn btn--primary">Add a listing</Link>

      {listings.length === 0 ? (
        <p>You have no listings yet.</p>
      ) : (
        <ul className="provider-list">
          {listings.map((l) => (
            <li key={l.id} className="card">
              <h2>{l.status === 'approved' ? <Link to={`/listings/${l.id}`}>{l.title}</Link> : l.title}</h2>
              <p className="muted">{kindLabel(l.kind)} &middot; {l.area?.name} &middot; {formatRand(l.monthly_rent_zar)} per month</p>
              <p><span className="badge">{listingStatusLabel(l.status)}</span></p>
              {(l.status === 'draft' || l.status === 'rejected') && (
                <button type="button" className="btn btn--primary" disabled={busyId === l.id} onClick={() => handleSubmit(l.id)}>
                  {busyId === l.id ? 'Submitting...' : 'Submit for review'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
