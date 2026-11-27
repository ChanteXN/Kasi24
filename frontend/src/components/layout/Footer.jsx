import { Link } from 'react-router-dom';
import Brand from './Brand';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <Brand />
            <p>Local stays. Local services. Real people. A community-first platform starting with accommodation discovery.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/search">Accommodation</Link>
            <Link to="/services">Services &mdash; coming soon</Link>
            <Link to="/#how-it-works">How it works</Link>
          </div>
          <div>
            <h4>For providers</h4>
            <Link to="/provider">List accommodation</Link>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; 2026 Kasi24</span>
          <span>Search &middot; Discover &middot; Compare &middot; Connect &mdash; enquiries only, no bookings or payments</span>
        </div>
      </div>
    </footer>
  );
}
