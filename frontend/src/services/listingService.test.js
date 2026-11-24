import { areaIdsWithChildren, findAreaByName, kindLabel, normaliseListing } from './listingService';

const areas = [
  { id: 'k', name: 'Khayelitsha', parent_area_id: null },
  { id: 'b', name: 'Site B', parent_area_id: 'k' },
  { id: 'c', name: 'Site C', parent_area_id: 'k' },
];

test('finds an area by exact or partial name, ignoring case', () => {
  expect(findAreaByName(areas, 'site b').id).toBe('b');
  expect(findAreaByName(areas, 'khaye').id).toBe('k');
  expect(findAreaByName(areas, 'Soweto')).toBeNull();
  expect(findAreaByName(areas, '  ')).toBeNull();
});

test('searching a parent area includes its children', () => {
  expect(areaIdsWithChildren(areas, 'k').sort()).toEqual(['b', 'c', 'k']);
  expect(areaIdsWithChildren(areas, 'b')).toEqual(['b']);
});

test('flattens amenities and orders images', () => {
  const row = normaliseListing({
    id: '1',
    amenities: [{ amenity: { code: 'wifi', label: 'Wi-Fi' } }, { amenity: null }],
    images: [
      { id: 'i2', object_path: 'a/2.jpg', sort_order: 2 },
      { id: 'i1', object_path: 'a/1.jpg', sort_order: 1 },
    ],
  });
  expect(row.amenities).toEqual([{ code: 'wifi', label: 'Wi-Fi' }]);
  expect(row.images.map((i) => i.id)).toEqual(['i1', 'i2']);
  expect(row.images[0].url).toContain('a/1.jpg');
});

test('labels listing kinds', () => {
  expect(kindLabel('backyard_room')).toBe('Backyard room');
  expect(kindLabel('unknown')).toBe('Other');
});
