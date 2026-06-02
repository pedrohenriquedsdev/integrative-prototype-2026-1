import { useEffect, useState } from 'react';
import { useTimer } from '../hooks/useTimer';

export default function QuestionCard({
  pergunta,
  perguntaAtual,
  totalPerguntas,
  onResposta,
  feedback,
  respostaClicada,
}) {
  const [podeResponder, setPodeResponder] = useState(true);
  const [transicaoRestante, setTransicaoRestante] = useState(0);
  const timer = useTimer(30, () => {
    if (!feedback) onResposta(-1);
  }, podeResponder);

  useEffect(() => {
    timer.resetarTimer();
    setPodeResponder(true);
    setTransicaoRestante(0);
  }, [perguntaAtual]);

  useEffect(() => {
    if (!feedback) return undefined;

    setPodeResponder(false);
    setTransicaoRestante(feedback.transitionSeconds || 5);

    const interval = window.setInterval(() => {
      setTransicaoRestante((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [feedback]);

  if (!pergunta) return null;

  return (
    <section className={`question-card ${feedback ? (feedback.acertou ? 'is-correct' : 'is-wrong') : ''}`}>
      <div className="question-header">
        <div>
          <p className="eyebrow">{pergunta.categoria} - {pergunta.dificuldade}</p>
          <h2>{pergunta.pergunta}</h2>
        </div>
        <div className={`timer ${timer.cor}`}>{timer.tempoRestante}s</div>
      </div>

      <div className="alternatives">
        {pergunta.alternativas.map((alternativa, index) => {
          const isCorrect = feedback && index === feedback.alternativaCorreta;
          const isWrong = feedback && respostaClicada === index && !feedback.acertou;

          return (
            <button
              key={alternativa}
              className={[
                'alternative',
                respostaClicada === index ? 'selected' : '',
                isCorrect ? 'correct' : '',
                isWrong ? 'wrong' : '',
              ].filter(Boolean).join(' ')}
              disabled={!podeResponder || !!feedback}
              onClick={() => onResposta(index)}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{alternativa}</strong>
            </button>
          );
        })}
      </div>

      <footer className="question-footer">
        <span>Pergunta {perguntaAtual + 1} de {totalPerguntas}</span>
        {feedback && (
          <strong className={feedback.acertou ? 'text-success' : 'text-danger'}>
            {feedback.acertou ? 'Resposta correta' : 'Resposta incorreta'}
          </strong>
        )}
      </footer>

      {feedback && (
        <aside className={`feedback-panel ${feedback.acertou ? 'success' : 'danger'}`} aria-live="polite">
          <div className="feedback-status">
            <span>{feedback.acertou ? 'Acerto confirmado' : 'Falha detectada'}</span>
            <strong>{feedback.acertou ? '+1 no placar tecnico' : 'Resposta correta revelada'}</strong>
          </div>

          <div className="feedback-copy">
            <p>
              <strong>Resposta correta:</strong> {String.fromCharCode(65 + feedback.alternativaCorreta)} - {feedback.alternativaCorretaTexto}
            </p>
            <p>{feedback.explicacao}</p>
          </div>

          <div className="transition-meter">
            <span>Proxima pergunta em {transicaoRestante}s</span>
            <div>
              <i style={{ width: `${(transicaoRestante / (feedback.transitionSeconds || 5)) * 100}%` }} />
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}
