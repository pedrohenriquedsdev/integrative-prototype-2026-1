export default function MatchResults({
  campeonato,
  jogador,
  adversario,
  resultado,
  scoreJogador,
  scoreAdversario,
  acertosJogador,
  totalPerguntas,
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

      <div className="result-actions">
        <button className="btn-secondary" onClick={() => setPage('historico')}>Historico</button>
        <button className="btn-primary" onClick={onRematch}>Nova partida</button>
        <button className="btn-secondary" onClick={() => setPage('ranking')}>Ranking</button>
      </div>
    </div>
  );
}
