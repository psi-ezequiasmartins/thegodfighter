/**
 * src/components/Layout.jsx
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSitemap, FaFileSignature, FaListOl, FaUsersCog, FaUserShield, FaMedal, FaWalking, FaBars, FaTimes } from "react-icons/fa";
import icon from '../assets/icon.png';
import './Layout.css';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('tgf_user') || '{}');
  const isAdmin = user.role === 'admin';

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const linkClass = ({ isActive }) => 
    `px-4 py-2 rounded-lg flex items-center gap-3 text-sm tracking-wider ${
      isActive ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
   }`;
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      {/* SIDEBAR DESKTOP */}
      <aside className="w-[240px] border-r border-zinc-800 p-6 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <img src={icon} className="mb-4 w-16 h-16 mx-auto" alt="TheGodFighterLogo" />
          <h1 className="font-black text-lg leading-none mb-6 tracking-widest text-center">TheGodFighter</h1>
          <hr className="border-zinc-800" />
          <p className="px-4 py-2 text-zinc-400 truncate">{user.name}</p>
          <hr className="border-zinc-800 mb-4" />
          <nav className="flex flex-col gap-1">
            <NavLink to="/events" className={linkClass}><FaSitemap size={24} /> EVENTOS</NavLink>
            <NavLink to="/ranking" className={linkClass}><FaMedal size={24} /> RANKING</NavLink>
            <NavLink to="/profile" className={linkClass}><FaFileSignature size={24} /> MEUS PALPITES</NavLink>
            {isAdmin && (
              <>
                <p className="px-4 pt-6 pb-1 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">ADMINISTRATOR</p>
                <NavLink to="/admin/events" className={linkClass}><FaListOl size={24} /> EVENTOS</NavLink>
                <NavLink to="/admin/fighters" className={linkClass}><FaUsersCog size={24} /> LUTADORES</NavLink>
                <NavLink to="/admin/users" className={linkClass}><FaUserShield size={24} /> USUÁRIOS</NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bloco de Logout */}
        <div className="flex flex-col gap-2">
          <hr className="border-zinc-800" />
          <button onClick={logout} 
            className="text-left px-4 py-3 text-zinc-500 hover:text-white flex items-center gap-3">
              <FaWalking size={24} /> SAÍDA (LOGOUT)
          </button>        
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPO MOBILE */}       
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-[#0a0a0a] sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img src={icon} className="w-10 h-10" alt="TheGodFighterLogo" />
            <h1 className="font-black text-base tracking-widest">TheGodFighter</h1>
          </div>

          <button 
            onClick={toggleMenu} 
            className="p-2 text-zinc-400 hover:text-white focus:outline-none" 
            id="menu-toggle"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button> 
        </header>

        {/* MENU MOBILE EXPANSÍVEL */}
        <div className={`md:hidden bg-[#0a0a0a] border-b border-zinc-800 px-4 py-4 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <p className="px-4 py-2 text-zinc-400 text-sm border-b border-zinc-800 mb-2 truncate">{user.name}</p>
          <nav className="flex flex-col gap-1">
            <NavLink to="/events" onClick={closeMenu} className={linkClass}><FaSitemap size={20} /> EVENTOS</NavLink>
            <NavLink to="/ranking" onClick={closeMenu} className={linkClass}><FaMedal size={20} /> RANKING</NavLink>
            <NavLink to="/profile" onClick={closeMenu} className={linkClass}><FaFileSignature size={20} /> MEUS PALPITES</NavLink>
            {isAdmin && (   
              <>
                <p className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">ADMINISTRATOR</p>
                <NavLink to="/admin/events" onClick={closeMenu} className={linkClass}><FaListOl size={20} /> EVENTOS</NavLink>
                <NavLink to="/admin/fighters" onClick={closeMenu} className={linkClass}><FaUsersCog size={20} /> LUTADORES</NavLink>
                <NavLink to="/admin/users" onClick={closeMenu} className={linkClass}><FaUserShield size={20} /> USUÁRIOS</NavLink>
              </>
            )}
            <hr className="border-zinc-800 my-2" />
            <button onClick={() => { closeMenu(); logout(); }} 
              className="text-left px-4 py-2 text-zinc-500 hover:text-white flex items-center gap-3 text-sm">
                <FaWalking size={20} /> SAÍDA (LOGOUT)
            </button> 
          </nav>
        </div>     

        <main className="max-w-3xl w-full mx-auto p-4 md:p-10">
          {children}
        </main> 
      </div>
    </div>
  );
}