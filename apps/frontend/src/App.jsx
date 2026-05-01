import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CrystalDetail from './pages/CrystalDetail';
import Favorites from './pages/Favorites';
import Creator from './pages/Creator';
import AddCrystal from './pages/AddCrystal';

function CelestialBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }}
        xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#C07840" strokeWidth="0.8">
          <line x1="80" y1="70" x2="80" y2="56"/><line x1="80" y1="70" x2="80" y2="84"/>
          <line x1="80" y1="70" x2="66" y2="70"/><line x1="80" y1="70" x2="94" y2="70"/>
          <circle cx="80" cy="70" r="1.5" fill="#C07840"/>
          <line x1="320" y1="130" x2="320" y2="121"/><line x1="320" y1="130" x2="320" y2="139"/>
          <line x1="320" y1="130" x2="311" y2="130"/><line x1="320" y1="130" x2="329" y2="130"/>
          <line x1="1280" y1="80" x2="1280" y2="66"/><line x1="1280" y1="80" x2="1280" y2="94"/>
          <line x1="1280" y1="80" x2="1266" y2="80"/><line x1="1280" y1="80" x2="1294" y2="80"/>
          <circle cx="1280" cy="80" r="1.5" fill="#C07840"/>
          <line x1="1100" y1="230" x2="1100" y2="223"/><line x1="1100" y1="230" x2="1100" y2="237"/>
          <line x1="1100" y1="230" x2="1093" y2="230"/><line x1="1100" y1="230" x2="1107" y2="230"/>
          <line x1="180" y1="380" x2="180" y2="373"/><line x1="180" y1="380" x2="180" y2="387"/>
          <line x1="180" y1="380" x2="173" y2="380"/><line x1="180" y1="380" x2="187" y2="380"/>
          <circle cx="180" cy="380" r="1" fill="#D4A355"/>
          <line x1="1320" y1="500" x2="1320" y2="491"/><line x1="1320" y1="500" x2="1320" y2="509"/>
          <line x1="1320" y1="500" x2="1311" y2="500"/><line x1="1320" y1="500" x2="1329" y2="500"/>
          <circle cx="1320" cy="500" r="1.5" fill="#C07840"/>
          <line x1="60" y1="620" x2="60" y2="613"/><line x1="60" y1="620" x2="60" y2="627"/>
          <line x1="60" y1="620" x2="53" y2="620"/><line x1="60" y1="620" x2="67" y2="620"/>
          <line x1="400" y1="800" x2="400" y2="791"/><line x1="400" y1="800" x2="400" y2="809"/>
          <line x1="400" y1="800" x2="391" y2="800"/><line x1="400" y1="800" x2="409" y2="800"/>
          <circle cx="400" cy="800" r="1" fill="#E8C98A"/>
          <line x1="980" y1="820" x2="980" y2="811"/><line x1="980" y1="820" x2="980" y2="829"/>
          <line x1="980" y1="820" x2="971" y2="820"/><line x1="980" y1="820" x2="989" y2="820"/>
          <circle cx="980" cy="820" r="1.5" fill="#C07840"/>
        </g>
        <g fill="#D4A355" opacity="0.75">
          <circle cx="200" cy="180" r="1.2"/><circle cx="500" cy="55" r="0.9"/><circle cx="780" cy="38" r="1.1"/>
          <circle cx="1050" cy="128" r="0.8"/><circle cx="40" cy="450" r="1.2"/><circle cx="1380" cy="300" r="1"/>
          <circle cx="270" cy="680" r="0.9"/><circle cx="860" cy="650" r="1.2"/><circle cx="550" cy="870" r="1"/>
        </g>
        <g transform="translate(105,820)" fill="none" stroke="#D4A355" strokeWidth="0.7" opacity="0.55">
          <path d="M 0 -24 A 24 24 0 1 1 0 24 A 16 16 0 1 0 0 -24 Z"/>
        </g>
        <g transform="translate(1340,175)" fill="none" stroke="#C07840" strokeWidth="0.7" opacity="0.5">
          <path d="M 0 -18 A 18 18 0 1 1 0 18 A 12 12 0 1 0 0 -18 Z"/>
        </g>
        <g transform="translate(700,450)" fill="none" stroke="#DDD0BC" strokeWidth="0.4" opacity="0.38">
          <circle r="200"/><circle r="140"/><circle r="90"/>
        </g>
        <g stroke="#DDD0BC" strokeWidth="0.4" opacity="0.3">
          <line x1="0" y1="0" x2="100" y2="100"/><line x1="1400" y1="0" x2="1300" y2="100"/>
          <line x1="0" y1="900" x2="100" y2="800"/><line x1="1400" y1="900" x2="1300" y2="800"/>
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
        <CelestialBg />
        <Navbar />
        <main style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
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
