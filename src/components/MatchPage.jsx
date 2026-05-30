import { useMemo } from 'react';
import { useMatch } from '../hooks/useMatch';
import { getQuestionsForMatch } from '../data/mockQuestions';
import { getAdversarioAleatorio, getCampeonatoAtivo, mockJogadorAtual } from '../data/mockMatches';
import QuestionCard from './QuestionCard';
import MatchResults from './MatchResults';

export default function MatchPage({ setPage }) {
  const campeonato = useMemo(() => getCampeonatoAtivo(), []);
  const perguntas = useMemo(() => getQuestionsForMatch(10), []);
  const adversario = useMemo(() => getAdversarioAleatorio(), []);
  const match = useMatch(perguntas, adversario);

  if (match.estadoPartida === 'preparando') {
    return (
      <div className="page-stack">
        <section className="match-prep">
          <div>
            <p className="eyebrow">Rodada {campeonato.rodada} de {campeonato.totalRodadas}</p>
            <h1>{campeonato.nome}</h1>
            <p>{campeonato.descricao}</p>
          </div>

          <div className="duel-board">
            <PlayerBlock label="Aluno" player={mockJogadorAtual} />
            <div className="duel-center">X1</div>
            <PlayerBlock label="Adversario" player={adversario} />
          </div>

          <div className="rules-grid">
            <span>10 perguntas</span>
            <span>30s por pergunta</span>
            <span>Vitoria: +3</span>
            <span>Empate: +1</span>
            <span>Derrota: +0</span>
          </div>

          <button className="btn-primary" onClick={match.iniciarPartida}>Iniciar partida</button>
        </section>
      </div>
    );
  }

  if (match.estadoPartida === 'finalizada') {
    return (
      <MatchResults
        campeonato={campeonato}
        jogador={mockJogadorAtual}
        adversario={adversario}
        resultado={match.calcularResultado()}
        scoreJogador={match.scoreJogador}
        scoreAdversario={match.scoreAdversario}
        acertosJogador={match.acertosJogador}
        totalPerguntas={match.totalPerguntas}
        onRematch={match.reiniciarPartida}
        setPage={setPage}
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="match-topbar">
        <div>
          <p className="eyebrow">{campeonato.nome}</p>
          <h1>Pergunta {match.perguntaAtual + 1} de {match.totalPerguntas}</h1>
        </div>
        <div className="scoreboard">
          <strong>{match.scoreJogador}</strong>
          <span>x</span>
          <strong>{match.scoreAdversario}</strong>
        </div>
      </section>

      <div className="match-layout">
        <QuestionCard
          pergunta={match.pergunta}
          perguntaAtual={match.perguntaAtual}
          totalPerguntas={match.totalPerguntas}
          onResposta={match.responderPergunta}
          feedback={match.feedbackResposta}
          respostaClicada={match.respostaClicada}
        />

        <aside className="match-aside">
          <div className="progress-track">
            <div style={{ width: `${match.percentualProgresso}%` }} />
          </div>
          <PlayerStat name={mockJogadorAtual.nome} score={match.scoreJogador} hits={match.acertosJogador} />
          <PlayerStat name={adversario.nome} score={match.scoreAdversario} hits={match.acertosAdversario} />
          <div className="ranking-rule">
            <strong>Ranking</strong>
            <span>3 pontos vitoria</span>
            <span>1 ponto empate</span>
            <span>0 ponto derrota</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PlayerBlock({ label, player }) {
  return (
    <div className="player-block">
      <span>{label}</span>
      <strong>{player.nome}</strong>
      <small>#{player.ranking} - {player.nivel}</small>
    </div>
  );
}

function PlayerStat({ name, score, hits }) {
  return (
    <div className="player-stat">
      <span>{name}</span>
      <strong>{score}</strong>
      <small>{hits} acertos</small>
    </div>
  );
}
