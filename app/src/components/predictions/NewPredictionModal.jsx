/**
 * src/components/predictions/NewPredictionModal.jsx
 */

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MySwal, swalDarkTheme } from '../../utils/swal';

function NewPredictionBody() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [fights, setFights] = useState([]);
  const [fightId, setFightId] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data.filter(e => e.status !== 'closed')))
      .catch(() => setStatus('Não foi possível carregar os eventos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFightId('');
    if (!eventId) { setFights([]); return; }
    api.get(`/events/${eventId}/fights`)
      .then(res => setFights(res.data.filter(f => !f.locked)))
      .catch(() => setStatus('Não foi possível carregar as lutas'));
  }, [eventId]);

  function goToFight() {
    if (!fightId) {
      setStatus('Selecione uma luta');
      return;
    }
    MySwal.close();
    window.location.href = `/fight/${fightId}`;
  }

  if (loading) return <p className="text-zinc-400 text-sm">Carregando eventos...</p>;

  return (
    <div className="text-left">
      <div className="grid gap-3 mb-3">
        <select value={eventId} onChange={e => setEventId(e.target.value)} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5">
          <option value="">Selecione o evento</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select value={fightId} onChange={e => setFightId(e.target.value)} disabled={!eventId} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 disabled:opacity-50">
          <option value="">{eventId ? 'Selecione a luta' : 'Escolha um evento primeiro'}</option>
          {fights.map(f => <option key={f.id} value={f.id}>{f.fighter1_name} vs {f.fighter2_name}</option>)}
        </select>
        {eventId && fights.length === 0 && (
          <p className="text-xs text-zinc-500">Nenhuma luta em aberto para palpitar neste evento.</p>
        )}
      </div>
      <button onClick={goToFight} className="bg-[#39FF14] text-black font-black px-6 py-2.5 rounded-xl w-full">CONTINUAR</button>
      {status && <p className="mt-3 text-sm text-zinc-400">{status}</p>}
    </div>
  );
}

export function openNewPredictionModal() {
  MySwal.fire({
    title: 'Novo palpite',
    html: <NewPredictionBody />,
    showConfirmButton: false,
    showCloseButton: true,
    width: 520,
    ...swalDarkTheme
  });
}
