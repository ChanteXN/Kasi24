import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import LandingPage from './LandingPage';
import { searchListings } from '../services/listingService';

vi.mock('../services/listingService', async (orig) => ({
  ...(await orig()),
  getAreas: vi.fn().mockResolvedValue([
    { id: 'k', name: 'Khayelitsha', parent_area_id: null },
    { id: 'b', name: 'Site B', parent_area_id: 'k' },
  ]),
  searchListings: vi.fn(),
}));

const listing = (id, kind, areaId, areaName) => ({
  id, title: `Stay ${id}`, kind, monthly_rent_zar: 1800, images: [], amenities: [],
  area: { id: areaId, name: areaName }, provider: { verification_status: 'approved' },
});

function SearchProbe() {
  const { search } = useLocation();
  return <p data-testid="search">{search}</p>;
}

function renderLanding() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => searchListings.mockResolvedValue([]));

test('shows the hero search with labelled fields and an empty state', async () => {
  renderLanding();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('close to home');
  expect(screen.getByLabelText('What are you looking for?')).toBeInTheDocument();
  expect(screen.getByLabelText('Location')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search stays' })).toBeInTheDocument();
  expect(await screen.findByText(/will appear here soon/)).toBeInTheDocument();
});

test('search sends keyword, area and rent to the search page', async () => {
  renderLanding();
  await screen.findByText(/will appear here soon/);
  fireEvent.change(screen.getByLabelText('What are you looking for?'), { target: { value: 'backyard' } });
  fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Site B' } });
  fireEvent.change(screen.getByLabelText(/Max rent/), { target: { value: '2000' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search stays' }));
  expect(screen.getByTestId('search')).toHaveTextContent('?q=backyard&area=Site+B&maxRent=2000');
});

test('quick rent chip searches by max rent', async () => {
  renderLanding();
  fireEvent.click(await screen.findByRole('button', { name: /Under R2.500/ }));
  expect(screen.getByTestId('search')).toHaveTextContent('maxRent=2500');
});

test('shows live counts and rails built from approved listings', async () => {
  searchListings.mockResolvedValue([
    listing('1', 'shack', 'b', 'Site B'),
    listing('2', 'shack', 'b', 'Site B'),
    listing('3', 'backyard_room', 'b', 'Site B'),
  ]);
  renderLanding();
  expect(await screen.findByRole('heading', { name: 'Latest stays' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Stays in Site B' })).toBeInTheDocument();
  const shack = screen.getByRole('link', { name: /Affordable standalone homes/ });
  expect(within(shack).getByText('2 stays')).toBeInTheDocument();
});
