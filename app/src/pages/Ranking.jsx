/**
 * src/pages/Ranking.jsx
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/ranking');
        setRanking(res.data);
      } catch {
        // MOCK pra você ver o layout mesmo sem backend pronto
        setRanking([
          { id: 1, name: 'Você', points: 128, correct_picks: 12 },
          { id: 2, name: 'João Silva', points: 115, correct_picks: 10 },
          { id: 3, name: 'Rafa MMA', points: 98, correct_picks: 8 },
        ]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <p className="text-zinc-500">Carregando ranking...</p>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Ranking Geral</h1>
      <p className="text-zinc-500 mb-8 text-sm">Pontuação baseada em acerto de vencedor + round + método</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-xs text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Jogador</div>
          <div className="col-span-2 text-center">Acertos</div>
          <div className="col-span-2 text-right">Pontos</div>
        </div>
        {ranking.map((user, index) => (
          <div key={user.id} className={`grid grid-cols-12 px-6 py-4 items-center ${index === 0 ? 'bg-white text-black' : 'border-b border-zinc-800/50 hover:bg-zinc-800/50'}`}>
            <div className="col-span-1 font-black">{index + 1}</div>
            <div className="col-span-7 font-bold">{user.name}</div>
            <div className="col-span-2 text-center">{user.correct_picks || 0}</div>
            <div className="col-span-2 text-right font-black">{user.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}