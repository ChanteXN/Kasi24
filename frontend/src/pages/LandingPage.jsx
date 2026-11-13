import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Screen 01 - see docs/design/screens/01_Landing_Page.png
export default function LandingPage() {
  const [area, setArea] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/search?area=${encodeURIComponent(area.trim())}`);
  }

  return (
    <section className="hero">
      <h1>Find a place to stay, close to the community</h1>
      <p>Search local accommodation, compare your options and contact providers directly.</p>
      <form className="search-bar" onSubmit={handleSubmit}>
        <label htmlFor="area">Location</label>
        <input id="area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area or township" required />
        <button type="submit" className="btn btn--primary">Search stays</button>
      </form>
    </section>
  );
}
