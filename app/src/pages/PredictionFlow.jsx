/**
 * src/pages/PredictionFlow.jsx - VERSÃO COM NAVEGAÇÃO CORRIGIDA
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function Stepper({ current }) {
  return (
    <div className="flex gap-2 mb-6">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-all ${
            s <= current ? 'bg-white' : 'bg-zinc-800'
          }`}
        />
      ))}
    </div>
  );
}

function PredictionFlow() {
  const params = useParams();
  const fightId = params.id;

  const [fight, setFight] = useState(null);
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState({
    fight_id: fightId,
    predicted_winner_name: '',
    predicted_round: null,
    predicted_method: ''
  });
  const [status, setStatus] = useState('');

  const isConfirmed = status.includes('travado');

  const fetchFight = useCallback(async function () {
    try {
      const res = await api.get('/fights/' + fightId);
      setFight(res.data);
    } catch (err) {
      setFight({ athlete1_name: 'Atleta 1', athlete2_name: 'Atleta 2', event_id: 1 });
    }
  }, [fightId]);

  useEffect(function () {
    fetchFight();
  }, [fetchFight]);

  function selectWinner(name) {
    setPick({ ...pick, predicted_winner_name: name });
    setStep(2);
  }

  function selectRound(round) {
    setPick({ ...pick, predicted_round: round });
    setStep(3);
  }

  function selectMethod(method) {
    setPick({ ...pick, predicted_method: method });
    setStep(4);
  }

  async function handleConfirm() {
    try {
      setStatus('Salvando...');
      const res = await api.post('/predictions', pick);
      setStatus('Palpite travado! ID: ' + res.data.id);
    } catch (err) {
      if (err.response) {
        setStatus('Erro: ' + err.response.data.msg);
      } else {
        setStatus('Erro de conexão');
      }
    }
  }

  if (!fight) {
    return <p className="p-10 text-center text-zinc-400">Carregando luta...</p>;
  }

  const athlete1 = fight.athlete1_name || fight.athlete1 || 'Atleta 1';
  const athlete2 = fight.athlete2_name || fight.athlete2 || 'Atleta 2';
  const eventId = fight.event_id || 1;

  return (
    <div className="p-6 bg-zinc-900 text-white rounded-2xl max-w-md mx-auto border border-zinc-800">
      {/* BREADCRUMB QUE REALMENTE NAVEGA */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/events" className="text-sm text-zinc-400 hover:text-white">
          ← Eventos
        </Link>
        <Link to={`/events/${eventId}`} className="text-sm text-zinc-400 hover:text-white">
          Voltar ao evento
        </Link>
      </div>

      <h2 className="text-2xl font-black my-2 tracking-tight">{athlete1} vs {athlete2}</h2>
      
      <Stepper current={step} />

      {step === 1 && (
        <div>
          <p className="mb-3 text-zinc-400 text-sm">Passo 1 de 4 - Quem vence?</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={function () { selectWinner(athlete1); }} className="bg-white text-black px-4 py-4 rounded-xl font-bold hover:bg-zinc-200 transition">
              {athlete1}
            </button>
            <button onClick={function () { selectWinner(athlete2); }} className="bg-white text-black px-4 py-4 rounded-xl font-bold hover:bg-zinc-200 transition">
              {athlete2}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-3 text-zinc-400 text-sm">Passo 2 de 4 - Qual Round? <button onClick={() => setStep(1)} className="ml-2 underline">voltar</button></p>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={function () { selectRound(1); }} className="bg-zinc-800 border border-zinc-700 px-4 py-4 rounded-xl font-bold hover:bg-white hover:text-black transition">1</button>
            <button onClick={function () { selectRound(2); }} className="bg-zinc-800 border border-zinc-700 px-4 py-4 rounded-xl font-bold hover:bg-white hover:text-black transition">2</button>
            <button onClick={function () { selectRound(3); }} className="bg-zinc-800 border border-zinc-700 px-4 py-4 rounded-xl font-bold hover:bg-white hover:text-black transition">3</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-3 text-zinc-400 text-sm">Passo 3 de 4 - Método? <button onClick={() => setStep(2)} className="ml-2 underline">voltar</button></p>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={function () { selectMethod('Nocaute'); }} className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-xl font-bold hover:bg-white hover:text-black transition">Nocaute</button>
            <button onClick={function () { selectMethod('Finalização'); }} className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-xl font-bold hover:bg-white hover:text-black transition">Finalização</button>
            <button onClick={function () { selectMethod('Decisão'); }} className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-xl font-bold hover:bg-white hover:text-black transition">Decisão</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <p className="mb-3 text-zinc-400 text-sm">Passo 4 de 4 - Confirmar? <button onClick={() => setStep(3)} className="ml-2 underline">voltar</button></p>
          
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 mb-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Seu palpite</p>
            <p className="font-bold text-lg mt-1">{pick.predicted_winner_name} no Round {pick.predicted_round} por {pick.predicted_method}</p>
          </div>

          <button 
            onClick={handleConfirm} 
            disabled={isConfirmed}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:cursor-not-allowed py-4 rounded-xl font-black tracking-wide transition"
          >
            {isConfirmed ? 'PALPITE CONFIRMADO' : 'CONFIRMAR PALPITE'}
          </button>
          
          {status && <p className={`mt-3 text-sm text-center ${isConfirmed ? 'text-green-400' : 'text-zinc-400'}`}>{status}</p>}

          {/* NAVEGAÇÃO QUE FALTAVA - SÓ APARECE DEPOIS DE CONFIRMAR */}
          {isConfirmed && (
            <div className="mt-6 grid grid-cols-2 gap-3 animate-in fade-in">
              <Link to="/events" className="bg-white text-black py-3.5 rounded-xl font-bold text-center hover:bg-zinc-200 transition">
                ← INÍCIO
              </Link>
              <Link to={`/events/${eventId}`} className="bg-zinc-800 border border-zinc-700 py-3.5 rounded-xl font-bold text-center hover:bg-zinc-700 transition">
                PRÓXIMA LUTA →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictionFlow;