/**
 * src/pages/Events.jsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch {
        // MOCK para visual
        setEvents([
          { id: 1, name: 'UFC 320', date: '2026-09-15', location: 'Las Vegas, NV', status: 'open', fights_count: 12 },
          { id: 2, name: 'The God Fighter - Edição 01', date: '2026-08-30', location: 'Belo Horizonte, MG', status: 'open', fights_count: 8 },
          { id: 3, name: 'UFC 319', date: '2026-08-10', location: 'Rio de Janeiro, RJ', status: 'closed', fights_count: 10 },
        ]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-zinc-900 rounded-2xl"/><div className="h-32 bg-zinc-900 rounded-2xl"/></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Eventos</h1>
          <p className="text-zinc-500 text-sm mt-1">Escolha um evento para dar seus palpites</p>
        </div>
        <span className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-400">{events.length} eventos</span>
      </div>

      <div className="grid gap-4">
        {events.map(event => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black tracking-widest ${event.status === 'open'? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                  {event.status === 'open'? 'ABERTO PARA PALPITES' : 'ENCERRADO'}
                </span>
                <span className="text-xs text-zinc-500">{new Date(event.date).toLocaleDateString('pt-BR')} • {event.location}</span>
              </div>
              <h2 className="text-xl font-black group-hover:text-white transition">{event.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">{event.fights_count} lutas • Pontuação em jogo</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold group-hover:scale-110 transition">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}