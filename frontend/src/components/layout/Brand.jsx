import { Link } from 'react-router-dom';

/** Kasi24 logo: roof mark + wordmark. */
export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Kasi24 home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M4 15.5 16 5l12 10.5v12H19v-8h-6v8H4v-12Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="m9 15 7-6 7 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand__name">Kasi<span>24</span></span>
    </Link>
  );
}
