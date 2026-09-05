/**
 * src/components/admin/FightFormModal.jsx
 */

import { useState } from 'react';
import api from '../../services/api';
import { MySwal, swalDarkTheme } from '../../utils/swal';

function FightFormBody({ initial, eventId, fighters, onSaved }) {
  const [form, setForm] = useState({
    fighter1_id: initial?.fighter1_id || '',
    fighter2_id: initial?.fighter2_id || '',
    weight_class: initial?.weight_class || ''
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.fighter1_id || !form.fighter2_id) {
      setStatus('Selecione os dois lutadores');
      return;
    }
    if (form.fighter1_id === form.fighter2_id) {
      setStatus('Os lutadores devem ser diferentes');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      if (initial?.id) {
        await api.put(`/fights/${initial.id}`, form);
      } else {
        await api.post(`/events/${eventId}/fights`, form);
      }
      onSaved();
      MySwal.close();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao salvar luta');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="text-left">
      <div className="grid grid-cols-3 gap-3 mb-3">
        <select value={form.fighter1_id} onChange={e=>setForm({...form, fighter1_id: Number(e.target.value)})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5">
          <option value="">Lutador 1</option>
          {fighters.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={form.fighter2_id} onChange={e=>setForm({...form, fighter2_id: Number(e.target.value)})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5">
          <option value="">Lutador 2</option>
          {fighters.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <input placeholder="Categoria de peso" value={form.weight_class} onChange={e=>setForm({...form, weight_class:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
      </div>
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="bg-[#39FF14] text-black font-black px-6 py-2.5 rounded-xl disabled:opacity-50">
          {saving ? 'SALVANDO...' : (initial?.id ? 'SALVAR' : 'CRIAR')}
        </button>
        <button onClick={() => MySwal.close()} className="bg-zinc-800 border border-zinc-700 px-6 py-2.5 rounded-xl font-bold">CANCELAR</button>
      </div>
      {status && <p className="mt-3 text-sm text-zinc-400">{status}</p>}
    </div>
  );
}

export function openFightModal({ initial, eventId, fighters, onSaved }) {
  MySwal.fire({
    title: initial?.id ? 'Editar luta' : 'Nova luta',
    html: <FightFormBody initial={initial} eventId={eventId} fighters={fighters} onSaved={onSaved} />,
    showConfirmButton: false,
    showCloseButton: true,
    width: 640,
    ...swalDarkTheme
  });
}
