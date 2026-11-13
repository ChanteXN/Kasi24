import { useParams } from 'react-router-dom';

// Screen 04 - see docs/design/screens/04_Listing_Details.png
// TODO: load with services/listingService.getListing(id)
export default function ListingDetailsPage() {
  const { id } = useParams();

  return (
    <section>
      <h1>Listing details</h1>
      <p>Listing {id} - gallery, amenities, price basis and provider info to be built.</p>
    </section>
  );
}
