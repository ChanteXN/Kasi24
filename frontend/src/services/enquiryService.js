import { apiRequest } from './api';

export function sendEnquiry(enquiry) {
  return apiRequest('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiry),
  });
}
