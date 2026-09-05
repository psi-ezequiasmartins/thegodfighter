/**
 * src/components/ImageUploader.jsx
 */

import { useState } from 'react';
import api, { resolveImageUrl } from '../services/api';

// Campo de imagem com upload de arquivo + fallback para URL manual
export default function ImageUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/uploads/image', formData);
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="col-span-2">
      <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
      {value && (
        <img src={resolveImageUrl(value)} alt="" className="w-full max-w-xl h-48 rounded-xl object-cover border border-zinc-700 mb-3" />
      )}
      <div className="flex items-center gap-3">
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="URL da imagem ou envie um arquivo"
          className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2.5"
        />
        <label className="text-sm bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-zinc-700 whitespace-nowrap">
          {uploading ? 'Enviando...' : 'Enviar arquivo'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
