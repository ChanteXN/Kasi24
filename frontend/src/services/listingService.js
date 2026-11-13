import { apiRequest } from './api';

export function searchListings(area) {
  const query = area ? `?area=${encodeURIComponent(area)}` : '';
  return apiRequest(`/listings${query}`);
}

export function getListing(id) {
  return apiRequest(`/listings/${id}`);
}
