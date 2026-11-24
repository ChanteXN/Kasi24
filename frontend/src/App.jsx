import { useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const { pathname } = useLocation();
  const fullWidth = pathname === '/' || pathname === '/services';
  return (
    <div className="app">
      <Header />
      <main className={fullWidth ? undefined : 'container'}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
