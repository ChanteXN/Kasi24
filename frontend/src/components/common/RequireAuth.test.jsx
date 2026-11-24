import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import RequireAuth from './RequireAuth';

const auth = vi.hoisted(() => ({ value: { user: null, loading: false } }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => auth.value }));

function renderAt() {
  render(
    <MemoryRouter initialEntries={['/provider']}>
      <Routes>
        <Route path="/login" element={<p>login page</p>} />
        <Route path="/provider" element={<RequireAuth><p>secret</p></RequireAuth>} />
      </Routes>
    </MemoryRouter>,
  );
}

test('sends signed-out visitors to the login page', () => {
  auth.value = { user: null, loading: false };
  renderAt();
  expect(screen.getByText('login page')).toBeInTheDocument();
});

test('shows the page to signed-in users', () => {
  auth.value = { user: { id: 'u1' }, loading: false };
  renderAt();
  expect(screen.getByText('secret')).toBeInTheDocument();
});

test('waits while the session is loading', () => {
  auth.value = { user: null, loading: true };
  renderAt();
  expect(screen.getByRole('status')).toBeInTheDocument();
});
