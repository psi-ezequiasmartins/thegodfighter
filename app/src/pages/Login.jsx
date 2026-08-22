/**
 * src/pages/Login.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function handleAuth(event) {
    event.preventDefault();
    setMsg('Carregando...');
    try {
      const endpoint = isRegister? '/auth/register' : '/auth/login';
      const payload = isRegister? { phone: phone, name: name } : { phone: phone };

      const res = await api.post(endpoint, payload);

      localStorage.setItem('tgf_token', res.data.token);
      localStorage.setItem('tgf_user', JSON.stringify(res.data.user));

      setMsg('Sucesso!');
      navigate('/events');
    } catch (err) {
      if (err.response) {
        setMsg(err.response.data.msg);
      } else {
        setMsg('Erro de conexão');
      }
    }
  }

  function toggleMode() {
    setIsRegister(!isRegister);
  }

  return (
    <div className="max-w-sm mx-auto bg-zinc-900 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{isRegister? 'Criar Conta' : 'Entrar'}</h2>
      <form onSubmit={handleAuth}>
        <input
          value={phone}
          onChange={function(e){ setPhone(e.target.value); }}
          placeholder="Telefone (ex: 31999999999)"
          className="w-full p-3 mb-3 bg-black rounded border border-zinc-700"
          required
        />
        {isRegister && (
          <input
            value={name}
            onChange={function(e){ setName(e.target.value); }}
            placeholder="Seu nome"
            className="w-full p-3 mb-3 bg-black rounded border border-zinc-700"
          />
        )}
        <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded">
          {isRegister? 'CADASTRAR' : 'ENTRAR'}
        </button>
      </form>
      <button onClick={toggleMode} className="mt-4 text-sm text-zinc-400 underline">
        {isRegister? 'Já tenho conta' : 'Criar conta nova'}
      </button>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}

export default Login;