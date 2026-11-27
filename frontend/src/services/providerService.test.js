import { MAX_UPLOAD_BYTES, listingStatusLabel, safeFileName, validateUpload } from './providerService';

const file = (type, size = 1000, name = 'a.pdf') => ({ type, size, name });

test('accepts JPG, PNG and PDF files up to 10 MB', () => {
  expect(validateUpload(file('application/pdf'))).toBeNull();
  expect(validateUpload(file('image/jpeg'))).toBeNull();
  expect(validateUpload(file('image/png', MAX_UPLOAD_BYTES))).toBeNull();
});

test('rejects missing, wrong-type and oversized files', () => {
  expect(validateUpload(null)).toMatch(/choose a file/i);
  expect(validateUpload(file('text/html'))).toMatch(/JPG, PNG or PDF/);
  expect(validateUpload(file('image/png', MAX_UPLOAD_BYTES + 1))).toMatch(/too large/i);
});

test('makes upload names safe for storage paths', () => {
  expect(safeFileName('my id (copy).pdf')).toBe('my_id__copy_.pdf');
  expect(safeFileName('../../etc/passwd')).not.toContain('/');
});

test('labels listing statuses for providers', () => {
  expect(listingStatusLabel('pending_review')).toBe('Awaiting review');
  expect(listingStatusLabel('approved')).toBe('Live');
  expect(listingStatusLabel('something_new')).toBe('something_new');
});
