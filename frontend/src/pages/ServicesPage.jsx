import { Link } from 'react-router-dom';

export default function ServicesPage() {
  return (
    <section className="wrap" style={{ padding: '48px 0' }}>
      <span className="soon-tag">COMING SOON</span>
      <h1>Local services are on the way</h1>
      <p>Soon you will be able to find trusted local plumbers, movers, cleaners and more. We are starting with accommodation.</p>
      <Link to="/search" className="btn btn--primary">Browse accommodation</Link>
    </section>
  );
}
