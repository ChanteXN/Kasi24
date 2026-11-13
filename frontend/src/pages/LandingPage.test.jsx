import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

test('shows a labelled location search', () => {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
  expect(screen.getByLabelText('Location')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search stays' })).toBeInTheDocument();
});
