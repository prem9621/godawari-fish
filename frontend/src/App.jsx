import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RatesPage from './pages/RatesPage';
import WholesalePage from './pages/WholesalePage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import AdminPanel from './admin/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/rates" element={<RatesPage />} />
                  <Route path="/wholesale" element={<WholesalePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </main>
              <Footer />
              <FloatingButtons />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
