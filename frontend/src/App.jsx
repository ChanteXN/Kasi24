import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
