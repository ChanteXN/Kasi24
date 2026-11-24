import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LandingPage from './LandingPage';

vi.mock('../services/listingService', async (orig) => ({
  ...(await orig()),
  getAreas: vi.fn().mockResolvedValue([{ id: '1', name: 'Site B', parent_id: null }]),
  searchListings: vi.fn().mockResolvedValue([]),
}));

test('shows the hero search with labelled filters', async () => {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('close to home');
  expect(screen.getByLabelText('Location')).toBeInTheDocument();
  expect(screen.getByLabelText('Type')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search stays' })).toBeInTheDocument();
  expect(await screen.findByText(/will appear here soon/)).toBeInTheDocument();
});
