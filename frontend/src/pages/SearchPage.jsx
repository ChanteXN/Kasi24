import { useSearchParams } from 'react-router-dom';

// Screen 03 - see docs/design/screens/03_Search_Discover.png
// TODO: filters, sorting, listing cards via services/listingService.searchListings
export default function SearchPage() {
  const [params] = useSearchParams();
  const area = params.get('area');

  return (
    <section>
      <h1>Stays {area ? `in ${area}` : ''}</h1>
      <p>Search results and filters - to be built.</p>
    </section>
  );
}
