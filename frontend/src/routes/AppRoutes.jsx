import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SearchPage from '../pages/SearchPage';
import ListingDetailsPage from '../pages/ListingDetailsPage';
import ComparePage from '../pages/ComparePage';
import EnquiryPage from '../pages/EnquiryPage';
import ServicesPage from '../pages/ServicesPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProviderPage from '../pages/ProviderPage';
import NewListingPage from '../pages/NewListingPage';
import RequireAuth from '../components/common/RequireAuth';

// One route per screen in docs/design (01-06)
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/listings/:id" element={<ListingDetailsPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/listings/:id/enquiry" element={<EnquiryPage />} />
      <Route path="/provider" element={<RequireAuth><ProviderPage /></RequireAuth>} />
      <Route path="/provider/listings/new" element={<RequireAuth><NewListingPage /></RequireAuth>} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
