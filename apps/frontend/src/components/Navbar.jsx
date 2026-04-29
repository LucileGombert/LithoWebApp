import { Link, useLocation } from 'react-router-dom';
import useFavoritesStore from '../store/useFavoritesStore';

const links = [
  { to: '/', label: 'Bibliothèque', icon: '💎' },
  { to: '/favorites', label: 'Favoris', icon: '❤️' },
  { to: '/creator', label: 'Créateur', icon: '✨' },
  { to: '/add-crystal', label: 'Ajouter', icon: '➕' },
];

export default function Navbar() {
  const location = useLocation();
  const { favorites } = useFavoritesStore();

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-serif text-xl text-stone-500 hover:text-violet-300 transition-colors">
            <span className="text-2xl">🔮</span>
            <span className="hidden sm:inline">LithoApp</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {links.map(link => {
              const isActive = location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-sky-300'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                  {link.to === '/favorites' && favorites.length > 0 && (
                    <span className="bg-violet-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
