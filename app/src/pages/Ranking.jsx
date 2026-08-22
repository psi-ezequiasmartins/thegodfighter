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
        setRanking([
          { id: 1, name: 'Ezequias Martins', points: 8, correct_picks: 1 },
        ]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <p className="text-zinc-500">Carregando ranking...</p>;

  const top3 = ranking.slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Ranking Geral</h1>
      <p className="text-zinc-500 mb-8 text-sm">Pontuação baseada em acerto de vencedor (5pts) + round (3pts) + método (7pts) = 15pts</p>

      {/* PÓDIO - aparece mesmo com 1 jogador */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8 items-end">
          {top3[1] && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center order-1">
              <div className="text-4xl mb-2">🥈</div>
              <div className="font-bold truncate">{top3[1]?.name}</div>
              <div className="text-zinc-500 text-sm">{top3[1]?.correct_picks || 0} acertos</div>
              <div className="font-black text-xl mt-2">{top3[1]?.points} pts</div>
            </div>
          )}
          <div className="bg-white text-black border border-white rounded-2xl p-8 text-center order-2 scale-105 shadow-xl">
            <div className="text-5xl mb-2">🥇</div>
            <div className="font-black text-lg truncate">{top3[0]?.name}</div>
            <div className="text-zinc-600 text-sm">{top3[0]?.correct_picks || 0} acertos</div>
            <div className="font-black text-2xl mt-2">{top3[0]?.points} pts</div>
          </div>
          {top3[2] && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center order-3">
              <div className="text-4xl mb-2">🥉</div>
              <div className="font-bold truncate">{top3[2]?.name}</div>
              <div className="text-zinc-500 text-sm">{top3[2]?.correct_picks || 0} acertos</div>
              <div className="font-black text-xl mt-2">{top3[2]?.points} pts</div>
            </div>
          )}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-xs text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Jogador</div>
          <div className="col-span-2 text-center">Acertos</div>
          <div className="col-span-2 text-right">Pontos</div>
        </div>
        {ranking.map((user, index) => (
          <div key={user.id} className={`grid grid-cols-12 px-6 py-4 items-center ${index === 0? 'bg-white text-black' : 'border-b border-zinc-800/50 hover:bg-zinc-800/50'}`}>
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