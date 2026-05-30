import { useState, useEffect, useCallback } from 'react';

// Hook para gerenciar timer da partida
export function useTimer(duracao = 30, onTimeout = () => {}, ativo = false) {
  const [tempoRestante, setTempoRestante] = useState(duracao);
  const [timeoutChamado, setTimeoutChamado] = useState(false);

  useEffect(() => {
    if (!ativo) return;

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          if (!timeoutChamado) {
            setTimeoutChamado(true);
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [ativo, onTimeout, timeoutChamado]);

  // Resetar timer
  const resetarTimer = useCallback(() => {
    setTempoRestante(duracao);
    setTimeoutChamado(false);
  }, [duracao]);

  // Porcentagem de tempo restante
  const percentualTempo = (tempoRestante / duracao) * 100;
  const cor =
    percentualTempo > 50 ? 'verde' : percentualTempo > 25 ? 'amarelo' : 'vermelho';

  return {
    tempoRestante,
    percentualTempo,
    cor,
    resetarTimer,
    timeout: timeoutChamado,
  };
}
