import { Link, useLocation } from 'react-router-dom';
import useFavoritesStore from '../store/useFavoritesStore';

const links = [
  { to: '/', label: 'Bibliothèque', sym: '✦' },
  { to: '/favorites', label: 'Favoris', sym: '♡' },
  { to: '/creator', label: 'Création artisanale', sym: '⟡' },
  { to: '/add-crystal', label: 'Ajouter', sym: '✧' },
];

export default function Navbar() {
  const location = useLocation();
  const { favorites } = useFavoritesStore();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,247,242,0.94)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem',
    }}>
      <Link to="/" style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.15rem', color: 'var(--text)',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        textDecoration: 'none',
      }}>
        <span style={{ color: 'var(--copper)', fontSize: '1.15rem' }}>☽</span>
        <span>LithoApp</span>
      </Link>

      <div style={{ display: 'flex', gap: '0.15rem' }}>
        {links.map(link => {
          const isActive = location.pathname === link.to ||
            (link.to !== '/' && location.pathname.startsWith(link.to));
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.38rem 0.8rem', borderRadius: '999px',
                fontSize: '0.8rem', fontWeight: 500,
                textDecoration: 'none', whiteSpace: 'nowrap',
                border: isActive ? '1px solid rgba(192,120,64,0.22)' : '1px solid transparent',
                background: isActive ? 'rgba(192,120,64,0.11)' : 'transparent',
                color: isActive ? 'var(--copper)' : 'var(--text-sec)',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{link.sym}</span>
              <span className="hidden sm:inline">{link.label}</span>
              {link.to === '/favorites' && favorites.length > 0 && (
                <span style={{
                  background: 'var(--copper)', color: '#fff',
                  fontSize: '0.58rem', width: '15px', height: '15px',
                  borderRadius: '50%', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {favorites.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
