/**
 * src/pages/AdminResult.jsx
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export default function AdminResult(){
  const { id } = useParams();
  const [fight, setFight] = useState(null);
  const [winnerFighterId, setWinnerFighterId] = useState('');
  const [round, setRound] = useState(1);
  const [method, setMethod] = useState('KO');
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/fights/${id}`);
      setFight(res.data);
      setWinnerFighterId(res.data.winner_fighter_id || '');
      if (res.data.winner_round) setRound(res.data.winner_round);
      if (res.data.winner_method) setMethod(res.data.winner_method);
    } catch {
      setStatus('Erro ao carregar a luta');
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!winnerFighterId) {
      setStatus('Selecione o vencedor');
      return;
    }
    try {
      await api.post(`/admin/fights/${id}/result`, {
        winner_fighter_id: winnerFighterId,
        winner_round: parseInt(round, 10),
        winner_method: method
      });
      setStatus('Resultado lançado! Pontos calculados!');
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao salvar resultado');
    }
  };

  if (!fight) return <p className="p-10 text-center text-zinc-400">Carregando luta...</p>;

  return(
    <div className="max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="font-black text-xl mb-2">🛡️ Admin • Lançar Resultado</h2>
      <p className="text-zinc-500 text-sm mb-6">{fight.fighter1_name} vs {fight.fighter2_name}</p>
      <select value={winnerFighterId} onChange={e=>setWinnerFighterId(e.target.value)} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 mb-4 mt-1">
        <option value="">Selecione o vencedor</option>
        <option value={fight.fighter1_id}>{fight.fighter1_name}</option>
        <option value={fight.fighter2_id}>{fight.fighter2_name}</option>
      </select>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select value={round} onChange={e=>setRound(e.target.value)} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>
        <select value={method} onChange={e=>setMethod(e.target.value)} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3"><option>KO</option><option>Finalização</option><option>Decisão</option></select>
      </div>
      <button onClick={save} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl">SALVAR RESULTADO</button>
      {status && <p className="mt-3 text-sm text-center text-zinc-400">{status}</p>}
    </div>
  )
}