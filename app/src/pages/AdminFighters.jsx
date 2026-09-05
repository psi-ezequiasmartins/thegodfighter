/**
 * src/pages/AdminFighters.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import api, { resolveImageUrl } from '../services/api';
import { openFighterModal } from '../components/admin/FighterFormModal';
import { confirmDelete } from '../utils/swal';

export default function AdminFighters() {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/fighters');
      setFighters(res.data);
      setError(null);
    } catch {
      setError('Não foi possível carregar os lutadores.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(id, name) {
    if (!(await confirmDelete(`O lutador "${name}" será removido permanentemente.`))) return;
    try {
      await api.delete(`/fighters/${id}`);
      load();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao remover lutador');
    }
  }

  if (loading) return <p className="text-zinc-500">Carregando lutadores...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Admin • Lutadores</h1>
        <button onClick={() => openFighterModal({ initial: null, onSaved: load })} className="bg-[#39FF14] text-black font-black px-5 py-2.5 rounded-xl">+ Novo lutador</button>
      </div>

      {status && <p className="mb-4 text-sm text-zinc-400">{status}</p>}

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : fighters.length === 0 ? (
        <p className="text-zinc-400">Nenhum lutador cadastrado ainda.</p>
      ) : (
        <div className="grid gap-3">
          {fighters.map(f => (
            <div key={f.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {f.photo_url && <img src={resolveImageUrl(f.photo_url)} alt="" className="w-14 h-14 rounded-lg object-cover border border-zinc-700" />}
                <div>
                  <p className="font-bold">{f.name} {f.nickname && <span className="text-zinc-500">"{f.nickname}"</span>}</p>
                  <p className="text-sm text-zinc-500">{f.weight_class || 'Sem categoria'} • {f.wins}V-{f.losses}D-{f.draws}E</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openFighterModal({ initial: f, onSaved: load })} className="text-sm bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg">Editar</button>
                <button onClick={() => remove(f.id, f.name)} className="text-sm bg-red-950/50 border border-red-900 text-red-400 px-4 py-2 rounded-lg">Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
