/**
 * src/pages/Fights.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../services/api';

export default function Fights() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('tgf_user') || '{}');
  const isAdmin = user.role === 'admin';

  const load = useCallback(async () => {
    try {
      const [eventRes, fightsRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/fights`)
      ]);
      setEvent(eventRes.data);
      setFights(fightsRes.data);
      setError(null);
    } catch {
      setError('Não foi possível carregar as lutas deste evento.');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-zinc-500">Carregando lutas...</p>;

  if (error) {
    return (
      <div className="bg-zinc-900 border border-red-900/50 rounded-2xl p-10 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const doneCount = fights.filter(f => f.has_prediction).length;
  const progress = fights.length > 0 ? (doneCount / fights.length) * 100 : 0;

  return (
    <div>
      <Link to="/events" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">← Todos os eventos</Link>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-black">{event?.name}</h1>
          {isAdmin && (
            <Link to={`/admin/events/${id}/fights`} className="text-xs bg-[#39FF14] text-black font-black px-3 py-1.5 rounded-full">+ Gerenciar lutas</Link>
          )}
        </div>
        <p className="text-zinc-500 text-sm mt-1">{fights.length} lutas para palpitar</p>
        <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-zinc-500 mt-2">{doneCount}/{fights.length} palpites feitos</p>
      </div>

      {fights.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-zinc-400">Nenhuma luta cadastrada para este evento ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {fights.map(fight => (
            <div
              key={fight.id}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden transition ${fight.has_prediction? 'border-green-900/50 bg-green-950/10' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <Link to={`/fight/${fight.id}`} className="block">
                <div className="relative w-full h-48 sm:h-60 flex">
                  <div className="w-1/2 h-full">
                    {fight.fighter1_photo_url ? (
                      <img src={resolveImageUrl(fight.fighter1_photo_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">{fight.fighter1_name}</div>
                    )}
                  </div>
                  <div className="w-1/2 h-full">
                    {fight.fighter2_photo_url ? (
                      <img src={resolveImageUrl(fight.fighter2_photo_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">{fight.fighter2_name}</div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/80 border border-zinc-700 text-white text-sm font-black w-12 h-12 rounded-full flex items-center justify-center">VS</span>
                  </div>
                </div>
              </Link>
              <div className="p-5 flex justify-between items-center">
                <Link to={`/fight/${fight.id}`}>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{fight.weight_class || 'Luta'}</span>
                  <h3 className="font-black text-lg mt-1">{fight.fighter1_name} vs {fight.fighter2_name}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  {isAdmin && !fight.locked && (
                    <Link to={`/admin/fights/${fight.id}/result`} className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-700">
                      Lançar resultado
                    </Link>
                  )}
                  {fight.has_prediction? (
                    <span className="text-xs bg-green-500 text-black px-3 py-1.5 rounded-full font-black">PALPITADO ✓</span>
                  ) : (
                    <Link to={`/fight/${fight.id}`} className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full">Palpitar</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}