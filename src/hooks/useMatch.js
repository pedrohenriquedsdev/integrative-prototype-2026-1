import { useCallback, useMemo, useRef, useState } from 'react';

export const RANKING_POINTS = {
  vitoria: 3,
  empate: 1,
  derrota: 0,
};

export function useMatch(perguntas, adversario) {
  const [estadoPartida, setEstadoPartida] = useState('preparando');
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [respostasAdversario, setRespostasAdversario] = useState([]);
  const [scoreJogador, setScoreJogador] = useState(0);
  const [scoreAdversario, setScoreAdversario] = useState(0);
  const [feedbackResposta, setFeedbackResposta] = useState(null);
  const [respostaClicada, setRespostaClicada] = useState(null);
  const lockedRef = useRef(false);

  const totalPerguntas = perguntas.length;
  const pergunta = perguntas[perguntaAtual];
  const percentualProgresso = totalPerguntas
    ? ((Math.min(perguntaAtual + 1, totalPerguntas)) / totalPerguntas) * 100
    : 0;

  const iniciarPartida = useCallback(() => {
    setEstadoPartida('em-andamento');
  }, []);

  const reiniciarPartida = useCallback(() => {
    lockedRef.current = false;
    setEstadoPartida('preparando');
    setPerguntaAtual(0);
    setRespostas([]);
    setRespostasAdversario([]);
    setScoreJogador(0);
    setScoreAdversario(0);
    setFeedbackResposta(null);
    setRespostaClicada(null);
  }, []);

  const finalizarPartida = useCallback(() => {
    lockedRef.current = false;
    setEstadoPartida('finalizada');
  }, []);

  const proximaPergunta = useCallback(() => {
    lockedRef.current = false;
    setFeedbackResposta(null);
    setRespostaClicada(null);

    setPerguntaAtual((atual) => {
      if (atual + 1 >= totalPerguntas) {
        finalizarPartida();
        return atual;
      }

      return atual + 1;
    });
  }, [finalizarPartida, totalPerguntas]);

  const responderPergunta = useCallback((indiceAlternativa) => {
    if (lockedRef.current || estadoPartida !== 'em-andamento' || !pergunta) return;

    lockedRef.current = true;
    const respostaValida = indiceAlternativa >= 0;
    const jogadorAcertou = respostaValida && indiceAlternativa === pergunta.correta;
    const precisaoAdversario = adversario?.winrate ?? 0.68;
    const adversarioAcertou = Math.random() < precisaoAdversario;

    setRespostaClicada(indiceAlternativa);
    setFeedbackResposta({
      acertou: jogadorAcertou,
      alternativaCorreta: pergunta.correta,
      resposta: indiceAlternativa,
      adversarioAcertou,
    });

    setRespostas((prev) => [
      ...prev,
      { perguntaId: pergunta.id, resposta: indiceAlternativa, acertou: jogadorAcertou },
    ]);
    setRespostasAdversario((prev) => [
      ...prev,
      { perguntaId: pergunta.id, acertou: adversarioAcertou },
    ]);

    if (jogadorAcertou) setScoreJogador((prev) => prev + 1);
    if (adversarioAcertou) setScoreAdversario((prev) => prev + 1);

    window.setTimeout(proximaPergunta, 1200);
  }, [adversario, estadoPartida, pergunta, proximaPergunta]);

  const calcularResultado = useCallback(() => {
    if (scoreJogador > scoreAdversario) {
      return {
        resultado: 'vitoria',
        titulo: 'Vitoria',
        pontos: RANKING_POINTS.vitoria,
        mensagem: `Voce venceu por ${scoreJogador} a ${scoreAdversario}.`,
      };
    }

    if (scoreJogador < scoreAdversario) {
      return {
        resultado: 'derrota',
        titulo: 'Derrota',
        pontos: RANKING_POINTS.derrota,
        mensagem: `O adversario venceu por ${scoreAdversario} a ${scoreJogador}.`,
      };
    }

    return {
      resultado: 'empate',
      titulo: 'Empate',
      pontos: RANKING_POINTS.empate,
      mensagem: `A disputa terminou em ${scoreJogador} a ${scoreAdversario}.`,
    };
  }, [scoreAdversario, scoreJogador]);

  const acertosJogador = scoreJogador;
  const acertosAdversario = scoreAdversario;

  return useMemo(() => ({
    estadoPartida,
    perguntaAtual,
    pergunta,
    totalPerguntas,
    percentualProgresso,
    scoreJogador,
    scoreAdversario,
    acertosJogador,
    acertosAdversario,
    feedbackResposta,
    respostaClicada,
    iniciarPartida,
    reiniciarPartida,
    responderPergunta,
    proximaPergunta,
    finalizarPartida,
    calcularResultado,
    respostas,
    respostasAdversario,
  }), [
    acertosAdversario,
    acertosJogador,
    calcularResultado,
    estadoPartida,
    feedbackResposta,
    finalizarPartida,
    iniciarPartida,
    pergunta,
    perguntaAtual,
    percentualProgresso,
    proximaPergunta,
    reiniciarPartida,
    responderPergunta,
    respostas,
    respostasAdversario,
    respostaClicada,
    scoreAdversario,
    scoreJogador,
    totalPerguntas,
  ]);
}
