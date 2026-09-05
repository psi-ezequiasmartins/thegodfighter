/**
 * src/pages/MeusPalpites.jsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../services/api';
import { confirmDelete } from '../utils/swal';
import { openNewPredictionModal } from '../components/predictions/NewPredictionModal';

export default function MeusPalpites() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  async function load() {
    try {
      const res = await api.get('/predictions/me');
      setPicks(res.data);
      setError(null);
    } catch {
      setError('Não foi possível carregar seus palpites.');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function removePick(fightId) {
    if (!(await confirmDelete('Este palpite será removido permanentemente.'))) return;
    try {
      await api.delete(`/predictions/${fightId}`);
      load();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao remover palpite');
    }
  }

  if (loading) return <p className="text-zinc-500">Carregando seus palpites...</p>;

  if (error) {
    return (
      <div className="bg-zinc-900 border border-red-900/50 rounded-2xl p-10 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Meus Palpites</h1>
        <button onClick={openNewPredictionModal} className="bg-[#39FF14] text-black font-black px-5 py-2.5 rounded-xl">+ Novo palpite</button>
      </div>

      {status && <p className="mb-4 text-sm text-zinc-400">{status}</p>}

      {picks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-zinc-400 mb-4">Você ainda não fez nenhum palpite.</p>
          <Link to="/events" className="bg-white text-black px-6 py-3 rounded-xl font-bold inline-block">Ver Eventos</Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {picks.map(p => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center -space-x-4 mb-3">
                {p.fighter1_photo_url ? (
                  <img src={resolveImageUrl(p.fighter1_photo_url)} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-900" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-900" />
                )}
                {p.fighter2_photo_url ? (
                  <img src={resolveImageUrl(p.fighter2_photo_url)} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-900" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-900" />
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{p.fight}</p>
                  <p className="text-sm text-zinc-400 mt-1">Round {p.predicted_round} - {p.predicted_method}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${p.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {p.points ? `${p.points} PTS` : 'PENDENTE'}
                  </span>
                  {!p.locked && (
                    <>
                      <Link to={`/fight/${p.fight_id}`} className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg">Editar</Link>
                      <button onClick={() => removePick(p.fight_id)} className="text-xs bg-red-950/50 border border-red-900 text-red-400 px-3 py-1.5 rounded-lg">Remover</button>
                    </>
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