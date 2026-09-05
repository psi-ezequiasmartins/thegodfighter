/**
 * src/components/admin/FighterFormModal.jsx
 */

import { useState } from 'react';
import api from '../../services/api';
import ImageUploader from '../ImageUploader';
import { MySwal, swalDarkTheme } from '../../utils/swal';

function FighterFormBody({ initial, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    nickname: initial?.nickname || '',
    weight_class: initial?.weight_class || '',
    wins: initial?.wins || 0,
    losses: initial?.losses || 0,
    draws: initial?.draws || 0,
    photo_url: initial?.photo_url || '',
    bio: initial?.bio || ''
  });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.name.trim()) {
      setStatus('Nome é obrigatório');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      if (initial?.id) {
        await api.put(`/fighters/${initial.id}`, form);
      } else {
        await api.post('/fighters', form);
      }
      onSaved();
      MySwal.close();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao salvar lutador');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="text-left">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input placeholder="Nome" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
        <input placeholder="Apelido" value={form.nickname} onChange={e=>setForm({...form, nickname:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
        <input placeholder="Categoria de peso" value={form.weight_class} onChange={e=>setForm({...form, weight_class:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
        <input type="number" placeholder="Vitórias" value={form.wins} onChange={e=>setForm({...form, wins:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
        <input type="number" placeholder="Derrotas" value={form.losses} onChange={e=>setForm({...form, losses:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
        <input type="number" placeholder="Empates" value={form.draws} onChange={e=>setForm({...form, draws:e.target.value})} className="bg-black border border-zinc-700 rounded-lg px-4 py-2.5" />
        <ImageUploader label="Foto do lutador" value={form.photo_url} onChange={url => setForm({...form, photo_url: url})} />
      </div>
      <textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2.5 mb-3" rows={3} />
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

export function openFighterModal({ initial, onSaved }) {
  MySwal.fire({
    title: initial?.id ? 'Editar lutador' : 'Novo lutador',
    html: <FighterFormBody initial={initial} onSaved={onSaved} />,
    showConfirmButton: false,
    showCloseButton: true,
    width: 640,
    ...swalDarkTheme
  });
}
