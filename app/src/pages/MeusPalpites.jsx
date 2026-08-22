/**
 * src/pages/MeusPalpites.jsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MeusPalpites() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/predictions/me');
        setPicks(res.data);
      } catch {
        setPicks([
          { id: 1, fight: 'Terremoto vs Oliveira', predicted_winner_name: 'Terremoto', predicted_round: 2, predicted_method: 'Finalização', status: 'pendente' },
        ]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <p className="text-zinc-500">Carregando seus palpites...</p>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Meus Palpites</h1>

      {picks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          <p className="text-zinc-400 mb-4">Você ainda não fez nenhum palpite.</p>
          <Link to="/events" className="bg-white text-black px-6 py-3 rounded-xl font-bold inline-block">Ver Eventos</Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {picks.map(p => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <p className="font-bold">{p.fight}</p>
                <p className="text-sm text-zinc-400 mt-1">{p.predicted_winner_name} - Round {p.predicted_round} - {p.predicted_method}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${p.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                {p.status?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}