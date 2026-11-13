-- FICTIONAL demo data for local development only.
-- Per the Workstream 1 scope guardrail, never present these as real listings or market prices.
insert into public.listings (name, area, type, description, max_guests, price, price_basis, amenities, provider_name)
values
    ('Sample Garden Room', 'Soweto', 'ROOM', 'Example listing for layout testing.', 2, 450.00, 'per night', 'Wi-Fi,Parking', 'Demo Provider A'),
    ('Sample Family Flat', 'Alexandra', 'APARTMENT', 'Example listing for layout testing.', 4, 900.00, 'per night', 'Wi-Fi,Kitchen,Secure entry', 'Demo Provider B'),
    ('Sample Guesthouse Suite', 'Tembisa', 'GUESTHOUSE', null, 3, null, null, 'Breakfast', 'Demo Provider C');
