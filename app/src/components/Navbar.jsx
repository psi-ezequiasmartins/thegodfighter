/**
 * src/components/Navbar.jsx
 */

import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('tgf_user') || '{}');

  function handleLogout() {
    localStorage.removeItem('tgf_token');
    localStorage.removeItem('tgf_user');
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/events" className="font-black text-xl tracking-wider">
          THE GOD FIGHTER
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/events" className="text-sm text-zinc-400 hover:text-white">
            Eventos
          </Link>
          {user.role === 'admin' && (
            <>
              <Link to="/admin/events" className="text-sm text-zinc-400 hover:text-white">
                Admin Eventos
              </Link>
              <Link to="/admin/fighters" className="text-sm text-zinc-400 hover:text-white">
                Lutadores
              </Link>
              <Link to="/admin/users" className="text-sm text-zinc-400 hover:text-white">
                Usuários
              </Link>
            </>
          )}
          <span className="text-sm text-zinc-600">
            {user.name || ''}
          </span>
          <button onClick={handleLogout} className="text-sm bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;