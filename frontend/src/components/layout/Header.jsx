import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Brand from './Brand';

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const signedIn = !loading && user;
  const close = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement">
        <div className="wrap announcement__inner">
          <span><strong>Kasi24</strong> &mdash; Local stays. Local services. Real people.</span>
          <span>Starting with accommodation in our communities</span>
        </div>
      </div>
      <header className="header">
        <div className="wrap header__inner">
          <Brand />
          <nav className="header__nav" aria-label="Main">
            <NavLink to="/search">Accommodation</NavLink>
            <NavLink to="/services">Services <span className="soon-tag">COMING SOON</span></NavLink>
            <Link to="/#how-it-works">How it works</Link>
            <Link to="/#about">About Kasi24</Link>
          </nav>
          <div className="header__actions">
            {signedIn ? (
              <button type="button" className="btn btn--ghost" onClick={() => signOut()}>Log out</button>
            ) : (
              <Link to="/login" className="btn btn--ghost">Log in</Link>
            )}
            <Link to="/provider" className="btn btn--dark">List your stay <span aria-hidden="true">&#8599;</span></Link>
          </div>
          <button
            type="button"
            className="header__menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            &#9776;
          </button>
        </div>
        <div id="mobile-menu" className={`header__mobile${menuOpen ? ' header__mobile--open' : ''}`}>
          <Link to="/search" onClick={close}>Accommodation</Link>
          <Link to="/services" onClick={close}>Services &middot; Coming soon</Link>
          <Link to="/#how-it-works" onClick={close}>How it works</Link>
          <Link to="/#about" onClick={close}>About Kasi24</Link>
          {signedIn ? (
            <button type="button" className="btn btn--ghost" onClick={() => { close(); signOut(); }}>Log out</button>
          ) : (
            <Link to="/login" onClick={close}>Log in</Link>
          )}
          <Link to="/provider" className="btn btn--dark btn--sm" onClick={close}>List your stay</Link>
        </div>
      </header>
    </>
  );
}
