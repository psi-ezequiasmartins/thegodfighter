/**
 * src/pages/AdminEvents.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../services/api';
import { openEventModal } from '../components/admin/EventFormModal';
import { confirmDelete } from '../utils/swal';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
      setError(null);
    } catch {
      setError('Não foi possível carregar os eventos.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(id, name) {
    if (!(await confirmDelete(`O evento "${name}" será removido permanentemente.`))) return;
    try {
      await api.delete(`/events/${id}`);
      load();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao remover evento');
    }
  }

  if (loading) return <p className="text-zinc-500">Carregando eventos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Admin • Eventos</h1>
        <button onClick={() => openEventModal({ initial: null, onSaved: load })} className="bg-[#39FF14] text-black font-black px-5 py-2.5 rounded-xl">+ Novo evento</button>
      </div>

      {status && <p className="mb-4 text-sm text-zinc-400">{status}</p>}

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-zinc-400">Nenhum evento cadastrado ainda.</p>
      ) : (
        <div className="grid gap-3">
          {events.map(e => (
            <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {e.image_url ? (
                <img src={resolveImageUrl(e.image_url)} alt="" className="w-full h-40 sm:h-52 object-cover" />
              ) : (
                <div className="w-full h-40 sm:h-52 bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">Sem imagem</div>
              )}
              <div className="p-5 flex justify-between items-center">
                <div>
                  <p className="font-bold">{e.name}</p>
                  <p className="text-sm text-zinc-500">{new Date(e.event_date).toLocaleString('pt-BR')} • {e.status} • {e.fights_count} lutas</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/events/${e.id}/fights`} className="text-sm bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg">Lutas</Link>
                  <button onClick={() => openEventModal({ initial: e, onSaved: load })} className="text-sm bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg">Editar</button>
                  <button onClick={() => remove(e.id, e.name)} className="text-sm bg-red-950/50 border border-red-900 text-red-400 px-4 py-2 rounded-lg">Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
