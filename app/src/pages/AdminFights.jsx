/**
 * src/pages/AdminFights.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../services/api';
import { openFightModal } from '../components/admin/FightFormModal';
import { confirmDelete } from '../utils/swal';

export default function AdminFights() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [fights, setFights] = useState([]);
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    try {
      const [eventRes, fightsRes, fightersRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/fights`),
        api.get('/fighters')
      ]);
      setEvent(eventRes.data);
      setFights(fightsRes.data);
      setFighters(fightersRes.data);
      setError(null);
    } catch {
      setError('Não foi possível carregar as lutas deste evento.');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function remove(fightId, label) {
    if (!(await confirmDelete(`A luta "${label}" será removida permanentemente.`))) return;
    try {
      await api.delete(`/fights/${fightId}`);
      load();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao remover luta');
    }
  }

  if (loading) return <p className="text-zinc-500">Carregando lutas...</p>;

  return (
    <div>
      <Link to="/admin/events" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">← Eventos</Link>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-black">Admin • Lutas</h1>
        <button onClick={() => openFightModal({ initial: null, eventId: id, fighters, onSaved: load })} className="bg-[#39FF14] text-black font-black px-5 py-2.5 rounded-xl">+ Nova luta</button>
      </div>
      <p className="text-zinc-500 text-sm mb-8">{event?.name}</p>

      {status && <p className="mb-4 text-sm text-zinc-400">{status}</p>}

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : fights.length === 0 ? (
        <p className="text-zinc-400">Nenhuma luta cadastrada ainda.</p>
      ) : (
        <div className="grid gap-3">
          {fights.map(f => (
            <div key={f.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center -space-x-4 mb-3">
                {f.fighter1_photo_url ? (
                  <img src={resolveImageUrl(f.fighter1_photo_url)} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-900" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-900" />
                )}
                {f.fighter2_photo_url ? (
                  <img src={resolveImageUrl(f.fighter2_photo_url)} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-900" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-900" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{f.fighter1_name} vs {f.fighter2_name}</p>
                  <p className="text-sm text-zinc-500">
                    {f.weight_class || 'Sem categoria'} • {f.locked ? 'Travada' : 'Aberta'}
                    {f.winner_name && ` • Vencedor: ${f.winner_name}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/fights/${f.id}/result`} className="text-sm bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg">Resultado</Link>
                  <button onClick={() => openFightModal({ initial: f, eventId: id, fighters, onSaved: load })} className="text-sm bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg">Editar</button>
                  <button onClick={() => remove(f.id, `${f.fighter1_name} vs ${f.fighter2_name}`)} className="text-sm bg-red-950/50 border border-red-900 text-red-400 px-4 py-2 rounded-lg">Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
