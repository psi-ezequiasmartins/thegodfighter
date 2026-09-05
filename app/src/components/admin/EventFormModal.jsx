/**
 * src/components/admin/EventFormModal.jsx
 */

import { useState } from 'react';
import api from '../../services/api';
import ImageUploader from '../ImageUploader';
import { MySwal, swalDarkTheme } from '../../utils/swal';

function toDatetimeLocal(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 16);
}

function EventFormBody({ initial, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    event_date: toDatetimeLocal(initial?.event_date),
    status: initial?.status || 'open',
    image_url: initial?.image_url || ''
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.name.trim() || !form.event_date) {
      setStatus('Nome e data são obrigatórios');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      if (initial?.id) {
        await api.put(`/events/${initial.id}`, form);
      } else {
        await api.post('/events', form);
      }
      onSaved();
      MySwal.close();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao salvar evento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="text-left">
      <div className="grid grid-cols-3 gap-3 mb-3">
        <input placeholder="Nome do evento" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 col-span-2" />
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5">
          <option value="open">Aberto</option>
          <option value="live">Ao vivo</option>
          <option value="closed">Encerrado</option>
        </select>
        <input type="datetime-local" value={form.event_date} onChange={e=>setForm({...form, event_date:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5 col-span-3" />
        <ImageUploader label="Imagem do evento" value={form.image_url} onChange={url => setForm({...form, image_url: url})} />
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

export function openEventModal({ initial, onSaved }) {
  MySwal.fire({
    title: initial?.id ? 'Editar evento' : 'Novo evento',
    html: <EventFormBody initial={initial} onSaved={onSaved} />,
    showConfirmButton: false,
    showCloseButton: true,
    width: 640,
    ...swalDarkTheme
  });
}
