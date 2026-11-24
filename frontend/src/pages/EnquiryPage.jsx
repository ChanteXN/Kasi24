import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ENQUIRY_MESSAGE_MAX, sendEnquiry } from '../services/enquiryService';
import { getListing } from '../services/listingService';

// Screen 06 - see docs/design/screens/06_Connect_Enquiry.png
// Sending an enquiry does not reserve a stay. Requires a signed-in customer (enforced by the database too).
export default function EnquiryPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const location = useLocation();

  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  useEffect(() => {
    getListing(id).then(setListing).catch(() => setListing(null));
  }, [id]);

  if (loading) return <p role="status">Loading...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setState('sending');
    try {
      await sendEnquiry({ listingId: id, message });
      setState('sent');
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <section className="card form-card">
        <h1>Enquiry sent</h1>
        <p>The provider has your message and can reply to you. This does not reserve the stay.</p>
        <Link to="/search">Keep looking</Link>
      </section>
    );
  }

  return (
    <section className="card form-card">
      <h1>Contact provider</h1>
      {listing && <p className="muted">About: {listing.title}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Your message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={ENQUIRY_MESSAGE_MAX}
            rows={6}
            required
            placeholder="Introduce yourself, when you need the room and how many people will stay."
          />
        </label>
        <p className="muted">{message.length}/{ENQUIRY_MESSAGE_MAX}. Sending an enquiry does not reserve a stay.</p>
        {error && <p role="alert" className="form__error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={state === 'sending' || !message.trim()}>
          {state === 'sending' ? 'Sending...' : 'Send enquiry'}
        </button>
      </form>
    </section>
  );
}
