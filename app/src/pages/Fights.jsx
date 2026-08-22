/**
 * src/pages/Fights.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Fights() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [fights, setFights] = useState([]);

  const load = useCallback(async () => {
    try {
      const [eventRes, fightsRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/fights`)
      ]);
      setEvent(eventRes.data);
      setFights(fightsRes.data);
    } catch {
      setEvent({ name: 'The God Fighter - Edição 01', date: '2026-08-30' });
      setFights([
        { id: 1, athlete1_name: 'Terremoto', athlete2_name: 'Oliveira', weight_class: 'Peso Leve', has_prediction: false },
        { id: 2, athlete1_name: 'Terremoto', athlete2_name: 'Oliveira', weight_class: 'Peso Pesado', has_prediction: true },
        { id: 3, athlete1_name: 'Silva', athlete2_name: 'Jones', weight_class: 'Peso Médio', has_prediction: false },
      ]);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <Link to="/events" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">← Todos os eventos</Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black">{event?.name}</h1>
        <p className="text-zinc-500 text-sm mt-1">{fights.length} lutas para palpitar</p>
        <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-white" style={{ width: `${(fights.filter(f=>f.has_prediction).length / fights.length)*100}%` }} />
        </div>
        <p className="text-xs text-zinc-500 mt-2">{fights.filter(f=>f.has_prediction).length}/{fights.length} palpites feitos</p>
      </div>

      <div className="grid gap-3">
        {fights.map(fight => (
          <Link
            key={fight.id}
            to={`/fight/${fight.id}`}
            className={`bg-zinc-900 border rounded-2xl p-5 flex justify-between items-center transition ${fight.has_prediction? 'border-green-900/50 bg-green-950/10' : 'border-zinc-800 hover:border-zinc-600'}`}
          >
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{fight.weight_class}</span>
              <h3 className="font-black text-lg mt-1">{fight.athlete1_name} vs {fight.athlete2_name}</h3>
            </div>
            <div className="text-right">
              {fight.has_prediction? (
                <span className="text-xs bg-green-500 text-black px-3 py-1.5 rounded-full font-black">PALPITADO ✓</span>
              ) : (
                <span className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full">Palpitar</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}