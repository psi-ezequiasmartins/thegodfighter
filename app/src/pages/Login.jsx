/**
 * src/pages/Login.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { maskPhone, unmaskPhone } from '../utils/phone';
import logomarca from '../assets/logomarca.png';

function Login() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  function handlePhoneChange(event) {
    setPhone(maskPhone(event.target.value));
  }

  async function handleAuth(event) {
    event.preventDefault();
    setMsg('Carregando...');
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { phone: unmaskPhone(phone), name } : { phone: unmaskPhone(phone) };

      const res = await api.post(endpoint, payload);
      localStorage.setItem('tgf_token', res.data.token);
      localStorage.setItem('tgf_user', JSON.stringify(res.data.user));

      setMsg('Sucesso!');
      navigate('/events');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Erro de conexão');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-center mb-6">
          <img src={logomarca} alt="Logomarca" className="h-64" /> 
        </div>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          THE GODFIGHTER
        </h2>
        <form onSubmit={handleAuth} className="space-y-3">
          <input
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(31) 99999-9999"
            inputMode="numeric"
            maxLength={15}
            className="w-full p-3 bg-black rounded border border-zinc-700 text-white placeholder-zinc-500 focus:border-white outline-none"
            required
          />
          {isRegister && (
            <input
              value={name}
              onChange={(e)=> setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full p-3 bg-black rounded border border-zinc-700 text-white placeholder-zinc-500 focus:border-white outline-none"
            />
          )}
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded hover:bg-zinc-200 transition">
            {isRegister ? 'CADASTRAR' : 'ENTRAR'}
          </button>
        </form>
        <button onClick={()=> setIsRegister(!isRegister)} className="mt-4 text-sm text-zinc-400 underline w-full text-center">
          {isRegister ? 'Já tenho conta' : 'Criar conta nova'}
        </button>
        {msg && <p className="mt-4 text-sm text-center text-zinc-300">{msg}</p>}
      </div>
    </div>
  );
}

export default Login;