import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LISTING_KINDS, getAreas } from '../services/listingService';
import {
  createListing,
  getAmenities,
  getMyProvider,
  uploadVerificationFile,
} from '../services/providerService';

const empty = {
  title: '', kind: 'backyard_room', area_id: '', description: '', monthly_rent_zar: '', deposit_zar: '',
  max_occupants: '', available_from: '', building_or_unit: '', locality_description: '', directions: '',
};

// Creates a draft listing. The exact address and the authority-to-let document stay private;
// customers only ever see the area, price and description.
export default function NewListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasProvider, setHasProvider] = useState(undefined);
  const [areas, setAreas] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState(empty);
  const [codes, setCodes] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    Promise.all([getMyProvider(user.id), getAreas(), getAmenities()])
      .then(([p, a, am]) => {
        setHasProvider(Boolean(p));
        setAreas(a);
        setAmenities(am);
      })
      .catch((err) => { setError(err.message); setHasProvider(false); });
  }, [user.id]);

  const toggleCode = (code) => setCodes((c) => (c.includes(code) ? c.filter((x) => x !== code) : [...c, code]));
  const numberOrNull = (v) => (v === '' ? null : Number(v));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const evidencePath = await uploadVerificationFile(user.id, file);
      await createListing({
        area_id: form.area_id,
        kind: form.kind,
        title: form.title,
        description: form.description,
        monthly_rent_zar: Number(form.monthly_rent_zar),
        deposit_zar: numberOrNull(form.deposit_zar),
        max_occupants: numberOrNull(form.max_occupants),
        available_from: form.available_from || null,
        amenity_codes: codes,
        address: {
          building_or_unit: form.building_or_unit,
          locality_description: form.locality_description,
          directions: form.directions,
        },
        evidence: [{ evidence_type: 'authority_to_let', object_path: evidencePath }],
      });
      navigate('/provider', { state: { created: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (hasProvider === undefined) return <p role="status">Loading...</p>;
  if (!hasProvider) {
    return (
      <section>
        <h1>Add a listing</h1>
        {error && <p role="alert" className="form__error">{error}</p>}
        <p>Complete provider onboarding first.</p>
        <Link to="/provider">Become a provider</Link>
      </section>
    );
  }

  return (
    <section className="card form-card form-card--wide">
      <h1>Add a listing</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>Title
          <input value={form.title} onChange={set('title')} minLength={3} maxLength={120} required />
        </label>
        <label>Type
          <select value={form.kind} onChange={set('kind')}>
            {LISTING_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </label>
        <label>Area
          <select value={form.area_id} onChange={set('area_id')} required>
            <option value="">Choose an area</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label>Description
          <textarea value={form.description} onChange={set('description')} maxLength={4000} rows={5} required />
        </label>
        <label>Monthly rent (R)
          <input type="number" min="0" max="100000" step="1" value={form.monthly_rent_zar} onChange={set('monthly_rent_zar')} required />
        </label>
        <label>Deposit (R, optional)
          <input type="number" min="0" max="100000" step="1" value={form.deposit_zar} onChange={set('deposit_zar')} />
        </label>
        <label>Maximum occupants (optional)
          <input type="number" min="1" max="50" step="1" value={form.max_occupants} onChange={set('max_occupants')} />
        </label>
        <label>Available from (optional)
          <input type="date" value={form.available_from} onChange={set('available_from')} />
        </label>

        <fieldset className="fieldset">
          <legend>What&apos;s included</legend>
          <div className="chips-select">
            {amenities.map((a) => (
              <label key={a.code} className="check">
                <input type="checkbox" checked={codes.includes(a.code)} onChange={() => toggleCode(a.code)} /> {a.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>Private address (not shown to customers)</legend>
          <label>Building or unit
            <input value={form.building_or_unit} onChange={set('building_or_unit')} maxLength={200} required />
          </label>
          <label>Street or locality
            <input value={form.locality_description} onChange={set('locality_description')} maxLength={500} required />
          </label>
          <label>Directions (optional)
            <textarea value={form.directions} onChange={set('directions')} maxLength={1000} rows={2} />
          </label>
        </fieldset>

        <label>Proof you may let this place (authority to let, JPG, PNG or PDF, max 10 MB)
          <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        </label>

        {error && <p role="alert" className="form__error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? 'Saving...' : 'Save draft'}</button>
      </form>
    </section>
  );
}
