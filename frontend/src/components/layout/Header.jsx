import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">Kasi24</Link>
        <nav className="header__nav" aria-label="Main">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search">Accommodation</NavLink>
          <NavLink to="/compare">Compare</NavLink>
          <NavLink to="/login" className="btn btn--primary">Log in</NavLink>
        </nav>
      </div>
    </header>
  );
}
