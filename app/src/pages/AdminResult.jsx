/**
 * src/pages/AdminResult.js
 */

import { useParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';

export default function AdminResult(){
  const { id } = useParams();
  const [winner,setWinner]=useState('');
  const [round,setRound]=useState(1);
  const [method,setMethod]=useState('KO');

  const save=async()=>{
    await api.post(`/fights/${id}/result`,{winner, round: parseInt(round), method});
    alert('Resultado lançado! Pontos calculados!');
  }
  return(
    <div className="max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="font-black text-xl mb-2">🛡️ Admin • Result Entry</h2>
      <p className="text-zinc-500 text-sm mb-6">Luta ID: {id}</p>
      <input value={winner} onChange={e=>setWinner(e.target.value)} placeholder="Ex: Terremoto" className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 mb-4 mt-1"/>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select value={round} onChange={e=>setRound(e.target.value)} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>
        <select value={method} onChange={e=>setMethod(e.target.value)} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3"><option>KO</option><option>Finalização</option><option>Decisão</option></select>
      </div>
      <button onClick={save} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl">SALVAR RESULTADO</button>
    </div>
  )
}