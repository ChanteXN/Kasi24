import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ListingCard from '../components/listings/ListingCard';
import { LISTING_KINDS, getAreas, searchListings } from '../services/listingService';
import heroHouse from '../assets/images/hero-house.jpg';
import heroBedroom from '../assets/images/hero-bedroom.jpg';
import heroLounge from '../assets/images/hero-lounge.jpg';
import '../styles/landing.css';

// Screen 01 - see docs/design/screens/01_Landing_Page.png and docs/design/refined
const STEPS = [
  { title: 'Search', text: 'Pick an area and the kind of place you need.' },
  { title: 'Discover', text: 'Browse real listings with photos, rent and what is included.' },
  { title: 'Compare', text: 'Shortlist your favourites and compare them side by side.' },
  { title: 'Connect', text: 'Send an enquiry and speak to the provider directly.' },
];

const TRUST = [
  { title: 'Verified providers', text: 'Providers submit proof they may let a place before listings go live.' },
  { title: 'Reviewed listings', text: 'Every listing is checked by our team before it is shown to customers.' },
  { title: 'Private addresses', text: 'Exact addresses stay private. You only see the area until you connect.' },
  { title: 'Enquiries only', text: 'No bookings or payments on Kasi24, so you stay in control.' },
];

const KIND_BLURBS = {
  backyard_room: 'Private rooms in a yard',
  shack: 'Affordable standalone homes',
  room_in_house: 'Share a home with a host',
  other: 'Other places to stay',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [areas, setAreas] = useState([]);
  const [area, setArea] = useState('');
  const [kind, setKind] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [featured, setFeatured] = useState({ status: 'loading', rows: [] });

  useEffect(() => {
    let cancelled = false;
    getAreas().then((a) => !cancelled && setAreas(a)).catch(() => {});
    searchListings({ limit: 3 })
      .then((rows) => !cancelled && setFeatured({ status: 'ready', rows }))
      .catch(() => !cancelled && setFeatured({ status: 'error', rows: [] }));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area) params.set('area', area);
    if (kind) params.set('kind', kind);
    if (maxRent) params.set('maxRent', maxRent);
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : '/search');
  }

  return (
    <div className="landing">
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <span className="eyebrow">Accommodation &middot; Khayelitsha</span>
            <h1>Find a place to stay, <em>close to home.</em></h1>
            <p className="hero__lead">
              Search local accommodation, compare your favourites and contact providers directly. Real places, real people.
            </p>
            <form className="search-panel" onSubmit={handleSubmit} aria-label="Search stays">
              <label>Location
                <select value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">All areas</option>
                  {areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
              </label>
              <label>Type
                <select value={kind} onChange={(e) => setKind(e.target.value)}>
                  <option value="">Any type</option>
                  {LISTING_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </label>
              <label>Max rent (R / month)
                <input type="number" min="0" step="50" inputMode="numeric" placeholder="Any" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} />
              </label>
              <button type="submit" className="btn btn--primary">Search stays</button>
            </form>
            <ul className="hero__points">
              <li>Verified providers</li>
              <li>No booking fees</li>
              <li>Enquiries sent directly</li>
            </ul>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <img className="hero__photo hero__photo--main" src={heroHouse} alt="" />
            <img className="hero__photo hero__photo--one" src={heroBedroom} alt="" />
            <img className="hero__photo hero__photo--two" src={heroLounge} alt="" />
            <div className="hero__note"><strong>Community first</strong><span>Local hosts, local stays</span></div>
            <div className="hero__caption"><strong>Backyard rooms</strong><span>From private rooms to shared homes</span></div>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="browse-title">
        <div className="section__head">
          <h2 id="browse-title">Browse by type</h2>
          <Link to="/search" className="section__link">See all stays &rarr;</Link>
        </div>
        <div className="category-grid">
          {LISTING_KINDS.map((k) => (
            <Link key={k.value} to={`/search?kind=${k.value}`} className="category-card">
              <strong>{k.label}</strong>
              <span>{KIND_BLURBS[k.value]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="featured-title">
        <div className="section__head">
          <h2 id="featured-title">Latest stays</h2>
          <Link to="/search" className="section__link">Search all &rarr;</Link>
        </div>
        {featured.status === 'loading' && <p role="status" className="muted">Loading stays...</p>}
        {featured.status === 'error' && <p className="muted">We could not load stays right now. <Link to="/search">Try the search page</Link>.</p>}
        {featured.status === 'ready' && featured.rows.length === 0 && (
          <p className="muted">New stays are being reviewed and will appear here soon.</p>
        )}
        {featured.rows.length > 0 && (
          <div className="listing-grid">
            {featured.rows.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      <section className="section wrap" id="how-it-works" aria-labelledby="how-title">
        <div className="section__head"><h2 id="how-title">How Kasi24 works</h2></div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="steps__num">{i + 1}</span>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap">
        <div className="service-band">
          <div>
            <span className="soon-tag">COMING SOON</span>
            <h2>Local services, next.</h2>
            <p>Plumbers, movers, cleaners and more from trusted people in your area. We are starting with accommodation.</p>
          </div>
          <Link to="/services" className="btn btn--gold">Learn more</Link>
        </div>
      </section>

      <section className="section wrap" id="about" aria-labelledby="trust-title">
        <div className="section__head"><h2 id="trust-title">Built on trust</h2></div>
        <div className="trust-grid">
          {TRUST.map((t) => (
            <div key={t.title} className="trust-card">
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="cta">
          <div>
            <h2>Have a room to let?</h2>
            <p>List your accommodation for free and reach people looking in your community.</p>
          </div>
          <Link to="/provider" className="btn btn--dark">List your stay</Link>
        </div>
      </section>
    </div>
  );
}
