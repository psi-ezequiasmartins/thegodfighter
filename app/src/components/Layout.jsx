/**
 * src/components/Layout.jsx
 */

import { NavLink, useNavigate, Link } from 'react-router-dom';
// Importação corrigida para a Web:
import { AiOutlineCalendar, AiOutlineTrophy, AiOutlineFileText } from 'react-icons/ai'; 
import { FaSitemap, FaFileSignature, FaListOl, FaUsersCog, FaUserShield, FaMedal, FaWalking } from "react-icons/fa";
import { MdSportsMma, MdSupervisedUserCircle, MdLogout } from 'react-icons/md';
import icon from '../assets/icon.png';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('tgf_user') || '{}');
  const isAdmin = user.role === 'admin';

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // CORREÇÃO AQUI: Mudamos 'block' para 'flex items-center gap-3' e ajustamos o texto para 'text-xs' ou 'text-sm' para melhor encaixe
  const linkClass = ({ isActive }) => 
    `px-4 py-2 rounded-lg flex items-center gap-3 text-sm tracking-wider ${
      isActive ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
   }`;
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* SIDEBAR DESKTOP */}
      <aside className="w-[240px] border-r border-zinc-800 p-6 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <img src={icon} className="mb-4 w-16 h-16 mx-auto" alt="TheGodFighterLogo" />
          <h1 className="font-black text-lg leading-none mb-6 tracking-widest text-center">TheGodFighter</h1>
          <hr className="border-zinc-800" />
          <p className="px-4 py-2 text-zinc-400">{user.name}</p>
          <hr className="border-zinc-800 mb-4" />
          <nav className="flex flex-col gap-1">
            <NavLink to="/events" className={linkClass}><FaSitemap  size={32} /> EVENTOS</NavLink>
            <NavLink to="/ranking" className={linkClass}><FaMedal size={32} /> RANKING</NavLink>
            <NavLink to="/profile" className={linkClass}><FaFileSignature size={32} /> MEUS PALPITES</NavLink>
            {isAdmin && (
              <>
                <p className="px-4 pt-6 pb-1 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">ADMINISTRATOR</p>
                {/* <hr className="border-zinc-800 mb-4" /> */}
                <NavLink to="/admin/events" className={linkClass}><FaListOl size={32} /> EVENTOS</NavLink>
                <NavLink to="/admin/fighters" className={linkClass}><FaUsersCog size={32} /> LUTADORES</NavLink>
                <NavLink to="/admin/users" className={linkClass}><FaUserShield size={32} /> USUÁRIOS</NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bloco de Logout com linha separadora superior */}
        <div className="flex flex-col gap-2">
          <hr className="border-zinc-800" />
          <button onClick={logout} 
            className="text-left px-4 py-3 text-zinc-500 hover:text-white flex items-center gap-3">
              <FaWalking size={32} /> Sair
          </button>        
        </div>
        
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