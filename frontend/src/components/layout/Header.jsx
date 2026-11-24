import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">Kasi24</Link>
        <nav className="header__nav" aria-label="Main">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search">Accommodation</NavLink>
          <NavLink to="/compare">Compare</NavLink>
          {!loading && user && <NavLink to="/provider">For providers</NavLink>}
          {!loading && user ? (
            <button type="button" className="btn btn--primary" onClick={() => signOut()}>Log out</button>
          ) : (
            <NavLink to="/login" className="btn btn--primary">Log in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
