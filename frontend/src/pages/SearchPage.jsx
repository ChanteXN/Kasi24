import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/listings/ListingCard';
import {
  LISTING_KINDS,
  areaIdsWithChildren,
  findAreaByName,
  getAreas,
  searchListings,
} from '../services/listingService';

// Screen 03 - see docs/design/screens/03_Search_Discover.png
// Filters live in the URL (?area=&kind=&maxRent=&sort=) so results can be shared and the landing page can link here.
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const areaName = params.get('area') ?? '';
  const kind = params.get('kind') ?? '';
  const maxRent = params.get('maxRent') ?? '';
  const sort = params.get('sort') ?? 'newest';

  const [areas, setAreas] = useState([]);
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAreas().then(setAreas).catch(() => setAreas([]));
  }, []);

  const selectedArea = useMemo(() => findAreaByName(areas, areaName), [areas, areaName]);
  const unknownArea = Boolean(areaName) && areas.length > 0 && !selectedArea;

  useEffect(() => {
    // Wait for areas so a typed area name can be resolved before the first query.
    if (areaName && areas.length === 0) return undefined;
    let cancelled = false;
    setStatus('loading');
    searchListings({
      areaIds: selectedArea ? areaIdsWithChildren(areas, selectedArea.id) : undefined,
      kind: kind || undefined,
      maxRent: maxRent ? Number(maxRent) : undefined,
      sort,
    })
      .then((rows) => {
        if (cancelled) return;
        setListings(rows);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus('error');
      });
    return () => { cancelled = true; };
  }, [areas, areaName, selectedArea, kind, maxRent, sort]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <section>
      <h1>Stays {selectedArea ? `in ${selectedArea.name}` : ''}</h1>

      <form className="filters card" onSubmit={(e) => e.preventDefault()} aria-label="Filter stays">
        <label>
          Area
          <select value={selectedArea?.id ? selectedArea.name : ''} onChange={(e) => updateParam('area', e.target.value)}>
            <option value="">All areas</option>
            {areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </label>
        <label>
          Type
          <select value={kind} onChange={(e) => updateParam('kind', e.target.value)}>
            <option value="">Any type</option>
            {LISTING_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </label>
        <label>
          Max rent (R per month)
          <input type="number" min="0" step="50" value={maxRent} onChange={(e) => updateParam('maxRent', e.target.value)} />
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value === 'newest' ? '' : e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </form>

      {unknownArea && <p className="muted">We don&apos;t list &ldquo;{areaName}&rdquo; yet, so here are stays from all areas.</p>}
      {status === 'loading' && <p role="status">Loading stays...</p>}
      {status === 'error' && <p role="alert" className="form__error">Could not load stays: {errorMessage}</p>}
      {status === 'ready' && listings.length === 0 && (
        <p>No stays match your search yet. Try another area or remove a filter.</p>
      )}
      {status === 'ready' && listings.length > 0 && (
        <>
          <p className="muted">{listings.length} {listings.length === 1 ? 'stay' : 'stays'} found</p>
          <div className="listing-grid">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </>
      )}
    </section>
  );
}
