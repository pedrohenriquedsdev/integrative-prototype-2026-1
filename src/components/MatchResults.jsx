export default function MatchResults({
  campeonato,
  jogador,
  adversario,
  resultado,
  scoreJogador,
  scoreAdversario,
  acertosJogador,
  totalPerguntas,
  revisao = [],
  onRematch,
  setPage,
}) {
  const percentualAcerto = totalPerguntas
    ? Math.round((acertosJogador / totalPerguntas) * 100)
    : 0;
  const novosPontos = jogador.pontos + resultado.pontos;

  return (
    <div className={`page-stack result-${resultado.resultado}`}>
      <section className="result-panel">
        <p className="eyebrow">{campeonato.nome}</p>
        <h1>{resultado.titulo}</h1>
        <p>{resultado.mensagem}</p>

        <div className="final-score">
          <div>
            <span>{jogador.nome}</span>
            <strong>{scoreJogador}</strong>
          </div>
          <span>x</span>
          <div>
            <span>{adversario.nome}</span>
            <strong>{scoreAdversario}</strong>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>Acertos</span>
          <strong>{acertosJogador}/{totalPerguntas}</strong>
        </div>
        <div className="metric-card">
          <span>Aproveitamento</span>
          <strong>{percentualAcerto}%</strong>
        </div>
        <div className="metric-card">
          <span>Pontos da partida</span>
          <strong>+{resultado.pontos}</strong>
        </div>
        <div className="metric-card">
          <span>Total no ranking</span>
          <strong>{novosPontos}</strong>
        </div>
      </section>

      <section className="result-rule">
        <strong>Regra aplicada</strong>
        <span>Vitoria soma 3 pontos, empate soma 1 ponto e derrota soma 0 ponto.</span>
      </section>

      <section className="study-review">
        <div className="study-review-header">
          <div>
            <p className="eyebrow">Laboratorio de estudo</p>
            <h2>Revisao tecnica do X1</h2>
            <p>Revise cada decisao tomada na partida e transforme o duelo em material de estudo.</p>
          </div>
          <div className="study-summary">
            <span>{acertosJogador} acertos</span>
            <strong>{totalPerguntas - acertosJogador} pontos para revisar</strong>
          </div>
        </div>

        <div className="review-list">
          {revisao.map((item, index) => (
            <article className={`review-card ${item.acertou ? 'success' : 'danger'}`} key={`${item.perguntaId}-${index}`}>
              <div className="review-card-top">
                <span>Questao {index + 1} - {item.categoria}</span>
                <strong>{item.acertou ? 'Acerto' : 'Erro'}</strong>
              </div>

              <h3>{item.pergunta}</h3>

              <div className="review-answer-grid">
                <div>
                  <span>Escolhida</span>
                  <strong>
                    {item.resposta >= 0 ? `${String.fromCharCode(65 + item.resposta)} - ${item.respostaTexto}` : item.respostaTexto}
                  </strong>
                </div>
                <div>
                  <span>Correta</span>
                  <strong>{String.fromCharCode(65 + item.correta)} - {item.corretaTexto}</strong>
                </div>
              </div>

              <div className="review-explanation">
                <span>Explicacao tecnica</span>
                <p>{item.explicacao}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="result-actions">
        <button className="btn-secondary" onClick={() => setPage('historico')}>Historico</button>
        <button className="btn-primary" onClick={onRematch}>Nova partida</button>
        <button className="btn-secondary" onClick={() => setPage('ranking')}>Ranking</button>
      </div>
    </div>
  );
}
