import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatRand } from '../components/listings/ListingCard';
import { getListing, kindLabel } from '../services/listingService';

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

// Screen 04 - see docs/design/screens/04_Listing_Details.png
// The exact address is never returned here: it lives in a private table and is only shared on request.
export default function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getListing(id)
      .then((row) => {
        if (cancelled) return;
        setListing(row);
        setStatus(row ? 'ready' : 'missing');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus('error');
      });
    return () => { cancelled = true; };
  }, [id]);

  if (status === 'loading') return <p role="status">Loading listing...</p>;
  if (status === 'error') return <p role="alert" className="form__error">Could not load this listing: {errorMessage}</p>;
  if (status === 'missing') {
    return (
      <section>
        <h1>Listing not available</h1>
        <p>This stay may have been removed or is no longer available.</p>
        <Link to="/search">Back to search</Link>
      </section>
    );
  }

  const { provider } = listing;

  return (
    <section className="listing-details">
      <p><Link to="/search">&larr; Back to results</Link></p>
      <h1>{listing.title}</h1>
      <p className="muted">{kindLabel(listing.kind)} &middot; {listing.area?.name ?? 'Area not stated'}</p>

      {listing.images.length > 0 && (
        <div className="gallery">
          {listing.images.map((img) => (
            <img key={img.id} src={img.url} alt={img.alt_text ?? listing.title} loading="lazy" />
          ))}
        </div>
      )}

      <div className="card">
        <p className="listing-card__price">{formatRand(listing.monthly_rent_zar)} <span className="muted">per month</span></p>
        <dl className="facts">
          <dt>Deposit</dt><dd>{formatRand(listing.deposit_zar)}</dd>
          <dt>Maximum occupants</dt><dd>{listing.max_occupants ?? 'Not stated'}</dd>
          <dt>Available from</dt><dd>{listing.available_from ? formatDate(listing.available_from) : 'Not stated'}</dd>
          {listing.last_availability_confirmed_at && (
            <><dt>Availability confirmed</dt><dd>{formatDate(listing.last_availability_confirmed_at)}</dd></>
          )}
        </dl>
      </div>

      <h2>About this stay</h2>
      <p className="prewrap">{listing.description}</p>

      <h2>What&apos;s included</h2>
      {listing.amenities.length > 0 ? (
        <ul className="chips">
          {listing.amenities.map((a) => <li key={a.code}>{a.label}</li>)}
        </ul>
      ) : (
        <p>Not stated</p>
      )}

      {provider && (
        <>
          <h2>Provider</h2>
          <p>
            {provider.business_name || provider.display_name}{' '}
            {provider.verification_status === 'approved' && <span className="badge">Verified provider</span>}
          </p>
          {provider.public_bio && <p className="prewrap">{provider.public_bio}</p>}
        </>
      )}

      <p className="muted">The exact address is shared by the provider after you get in touch.</p>
      <Link to={`/listings/${listing.id}/enquiry`} className="btn btn--primary">Contact provider</Link>
    </section>
  );
}
