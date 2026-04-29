import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CrystalDetail from './pages/CrystalDetail';
import Favorites from './pages/Favorites';
import Creator from './pages/Creator';
import AddCrystal from './pages/AddCrystal';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crystals/:id" element={<CrystalDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/add-crystal" element={<AddCrystal />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
