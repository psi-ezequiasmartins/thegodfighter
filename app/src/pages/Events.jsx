/**
 * src/pages/Events.jsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('tgf_user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
        setError(null);
      } catch {
        setError('Não foi possível carregar os eventos. Tente novamente.');
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-zinc-900 rounded-2xl"/><div className="h-32 bg-zinc-900 rounded-2xl"/></div>;

  if (error) {
    return (
      <div className="bg-zinc-900 border border-red-900/50 rounded-2xl p-10 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Eventos</h1>
          <p className="text-zinc-500 text-sm mt-1">Escolha um evento para dar seus palpites</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-400">{events.length} eventos</span>
          {isAdmin && (
            <Link to="/admin/events" className="text-xs bg-[#39FF14] text-black font-black px-3 py-1.5 rounded-full">+ Gerenciar eventos</Link>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-zinc-400">Nenhum evento cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all"
            >
              <Link to={`/events/${event.id}`}>
                {event.image_url ? (
                  <img src={resolveImageUrl(event.image_url)} alt="" className="w-full h-48 sm:h-64 object-cover" />
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">Sem imagem</div>
                )}
              </Link>
              <div className="p-6 flex justify-between items-center">
                <Link to={`/events/${event.id}`} className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black tracking-widest ${event.status === 'open'? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      {event.status === 'open'? 'ABERTO PARA PALPITES' : 'ENCERRADO'}
                    </span>
                    <span className="text-xs text-zinc-500">{new Date(event.event_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h2 className="text-xl font-black group-hover:text-white transition">{event.name}</h2>
                  <p className="text-sm text-zinc-500 mt-1">{event.fights_count} lutas • Pontuação em jogo</p>
                </Link>
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link to={`/admin/events/${event.id}/fights`} className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-700">
                      Editar lutas
                    </Link>
                  )}
                  <Link to={`/events/${event.id}`} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold group-hover:scale-110 transition">→</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}