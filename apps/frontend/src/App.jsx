import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CrystalDetail from './pages/CrystalDetail';
import Favorites from './pages/Favorites';
import Creator from './pages/Creator';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-950">
        <Navbar />
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crystals/:id" element={<CrystalDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/creator" element={<Creator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
