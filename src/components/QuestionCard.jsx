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
  const timer = useTimer(30, () => {
    if (!feedback) onResposta(-1);
  }, podeResponder);

  useEffect(() => {
    timer.resetarTimer();
    setPodeResponder(true);
  }, [perguntaAtual]);

  useEffect(() => {
    if (feedback) setPodeResponder(false);
  }, [feedback]);

  if (!pergunta) return null;

  return (
    <section className="question-card">
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
    </section>
  );
}
