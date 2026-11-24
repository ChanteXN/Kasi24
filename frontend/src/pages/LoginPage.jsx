import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Screen 02 - see docs/design/screens/02_Login_Account_Access.png
// Everyone signs up as a customer; becoming a provider is a separate onboarding step (api: provider/onboard).
export default function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from ?? '/';

  const [mode, setMode] = useState('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to={returnTo} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
        navigate(returnTo, { replace: true });
      } else {
        const signedIn = await signUp(email.trim(), password, displayName.trim());
        if (signedIn) navigate(returnTo, { replace: true });
        else setNotice('Account created. Check your email to confirm your address, then log in.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const isSignUp = mode === 'signup';

  return (
    <section className="card form-card">
      <h1>{isSignUp ? 'Create an account' : 'Log in'}</h1>
      <form onSubmit={handleSubmit} className="form">
        {isSignUp && (
          <label>
            Your name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80} required />
          </label>
        )}
        <label>
          Email
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p role="alert" className="form__error">{error}</p>}
        {notice && <p role="status" className="form__notice">{notice}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'}
        </button>
      </form>
      <p>
        {isSignUp ? 'Already have an account?' : 'New to Kasi24?'}{' '}
        <button type="button" className="link-button" onClick={() => { setMode(isSignUp ? 'login' : 'signup'); setError(''); setNotice(''); }}>
          {isSignUp ? 'Log in' : 'Create an account'}
        </button>
      </p>
    </section>
  );
}
