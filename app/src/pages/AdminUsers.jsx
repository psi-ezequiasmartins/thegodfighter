/**
 * src/pages/AdminUsers.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { maskPhone } from '../utils/phone';

const roleLabels = { fan: 'Fã', athlete: 'Atleta', admin: 'Admin' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setError(null);
    } catch {
      setError('Não foi possível carregar os usuários.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function changeRole(id, role) {
    try {
      await api.put(`/users/${id}/role`, { role });
      setStatus('Papel atualizado');
      load();
    } catch (err) {
      setStatus(err.response?.data?.msg || 'Erro ao atualizar papel');
    }
  }

  if (loading) return <p className="text-zinc-500">Carregando usuários...</p>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Admin • Usuários</h1>

      {status && <p className="mb-4 text-sm text-zinc-400">{status}</p>}

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="grid gap-3">
          {users.map(u => (
            <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <p className="font-bold">{u.name || 'Sem nome'}</p>
                <p className="text-sm text-zinc-500">{maskPhone(u.phone)} • {roleLabels[u.role] || u.role}</p>
              </div>
              <select
                value={u.role}
                onChange={e => changeRole(u.id, e.target.value)}
                className="bg-black border border-zinc-700 rounded-lg px-4 py-2 text-sm"
              >
                <option value="fan">Fã</option>
                <option value="athlete">Atleta</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
