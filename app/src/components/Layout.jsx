/**
 * src/components/Layout.jsx
 */

import { NavLink, useNavigate, Link } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const linkClass = ({ isActive }) => 
    `px-4 py-3 rounded-lg block ${isActive ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* SIDEBAR DESKTOP */}
      <aside className="w-[240px] border-r border-zinc-800 p-6 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <h1 className="font-black text-lg leading-none mb-10 tracking-widest">THE GOD<br/>FIGHTER</h1>
          <nav className="flex flex-col gap-2">
            <NavLink to="/events" className={linkClass}>🏟️ Eventos</NavLink>
            <NavLink to="/ranking" className={linkClass}>🏆 Ranking</NavLink>
            <NavLink to="/profile" className={linkClass}>👤 Meus Palpites</NavLink>
          </nav>
        </div>
        <button onClick={logout} className="text-left px-4 py-3 text-zinc-500 hover:text-white">Sair →</button>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1">
        {/* TOPO MOBILE */}
        <header className="md:hidden flex justify-between items-center p-4 border-b border-zinc-800">
          <span className="font-black">THE GOD FIGHTER</span>
          <Link to="/events" className="text-sm bg-zinc-800 px-3 py-1.5 rounded">Eventos</Link>
        </header>
        <main className="max-w-3xl mx-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}