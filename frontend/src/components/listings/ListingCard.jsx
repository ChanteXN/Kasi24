import { Link } from 'react-router-dom';
import { kindLabel } from '../../services/listingService';

export const formatRand = (amount) =>
  amount == null ? 'Not stated' : `R${Number(amount).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;

export default function ListingCard({ listing }) {
  const photo = listing.images[0];
  return (
    <article className="card listing-card">
      {photo ? (
        <img src={photo.url} alt={photo.alt_text ?? listing.title} className="listing-card__photo" loading="lazy" />
      ) : (
        <div className="listing-card__photo listing-card__photo--empty" aria-hidden="true">No photo yet</div>
      )}
      <div className="listing-card__body">
        <h2><Link to={`/listings/${listing.id}`}>{listing.title}</Link></h2>
        <p className="muted">{kindLabel(listing.kind)} &middot; {listing.area?.name ?? 'Area not stated'}</p>
        <p className="listing-card__price">{formatRand(listing.monthly_rent_zar)} <span className="muted">per month</span></p>
        {listing.provider?.verification_status === 'approved' && <span className="badge">Verified provider</span>}
      </div>
    </article>
  );
}
