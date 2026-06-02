import { useMemo, useState } from 'react';
import MatchPage from './components/MatchPage';
import {
  calculateGeneralRanking,
  calculateSubjectRanking,
  mockHistoricoPartidas,
  mockJogadorAtual,
  subjectResults,
  weeklySubjects,
} from './data/mockMatches';

const rankingDemoSubject = 'termodinamica';

const loginAccounts = [
  {
    role: 'student',
    username: 'aluno',
    password: '123',
    name: mockJogadorAtual.nome,
    label: 'Aluno',
    startPage: 'inicio',
  },
  {
    role: 'professor',
    username: 'professor',
    password: '123',
    name: 'Prof. Carlos Eduardo',
    label: 'Professor',
    startPage: 'prof-dashboard',
  },
];

const baseQuestions = [
  { id: 1, question: 'Explique o conceito de torque.', theme: 'Mecanica', difficulty: 'Medio', uses: 12 },
  { id: 2, question: 'Quando ocorre deformacao plastica?', theme: 'Materiais', difficulty: 'Medio', uses: 9 },
  { id: 3, question: 'Defina conducao termica.', theme: 'Termodinamica', difficulty: 'Facil', uses: 15 },
];

export default function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [page, setPage] = useState('inicio');
  const [rankingResults, setRankingResults] = useState(subjectResults);
  const [lastRankingEvent, setLastRankingEvent] = useState(null);
  const role = loggedUser?.role || 'student';

  const nav = role === 'student'
    ? [
        { id: 'inicio', label: 'Painel' },
        { id: 'partida', label: 'X1' },
        { id: 'ranking', label: 'Ranking' },
        { id: 'historico', label: 'Historico' },
      ]
    : [
        { id: 'prof-dashboard', label: 'Painel' },
        { id: 'prof-perguntas', label: 'Perguntas' },
        { id: 'prof-ranking', label: 'Rankings' },
        { id: 'prof-campeonato', label: 'Campeonato' },
      ];

  const generalRanking = useMemo(() => calculateGeneralRanking(rankingResults), [rankingResults]);

  function login(credentials) {
    const account = loginAccounts.find((user) => (
      user.role === credentials.role
      && user.username === credentials.username.trim().toLowerCase()
      && user.password === credentials.password
    ));

    if (!account) return false;

    setLoggedUser(account);
    setPage(account.startPage);
    return true;
  }

  function logout() {
    setLoggedUser(null);
    setPage('inicio');
  }

  function applyRankingResult(result, source = 'Partida X1 concluida') {
    const fieldByResult = {
      vitoria: 'vitorias',
      empate: 'empates',
      derrota: 'derrotas',
    };
    const field = fieldByResult[result] || 'vitorias';

    setRankingResults((students) => students.map((student) => {
      if (student.nome !== mockJogadorAtual.nome) return student;

      const previousRecord = student.subjects[rankingDemoSubject] || {
        vitorias: 0,
        empates: 0,
        derrotas: 0,
      };

      return {
        ...student,
        subjects: {
          ...student.subjects,
          [rankingDemoSubject]: {
            ...previousRecord,
            [field]: previousRecord[field] + 1,
          },
        },
      };
    }));

    setLastRankingEvent({
      id: Date.now(),
      student: mockJogadorAtual.nome,
      result,
      source,
    });
  }

  function runRankingDemo() {
    applyRankingResult('vitoria', 'Teste demonstrativo: vitoria simulada em Termodinamica');
  }

  if (!loggedUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage(role === 'student' ? 'inicio' : 'prof-dashboard')}>
          <span className="brand-mark">TQ</span>
          <span>
            <strong>TorqueQuiz</strong>
            <small>Engenharia Mecanica</small>
          </span>
        </button>

        <div className="session-card" aria-label="Sessao ativa">
          <span>{loggedUser.label}</span>
          <strong>{loggedUser.name}</strong>
          <small>{role === 'student' ? 'Area de aluno liberada' : 'Area de professor liberada'}</small>
        </div>

        <nav className="sidebar-nav">
          {nav.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? 'active' : ''}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>{loggedUser.name}</span>
          <strong>{role === 'student' ? `#${generalRanking.find((row) => row.nome === mockJogadorAtual.nome)?.rank || '-'} - ${generalRanking.find((row) => row.nome === mockJogadorAtual.nome)?.pontos || 0} pts` : 'Banco de temas'}</strong>
          <button className="logout-button" onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="content">
        {role === 'student' && page === 'inicio' && (
          <HomePage
            setPage={setPage}
            generalRanking={generalRanking}
            lastRankingEvent={lastRankingEvent}
            onDemo={runRankingDemo}
          />
        )}
        {role === 'student' && page === 'partida' && (
          <MatchPage
            setPage={setPage}
            onMatchComplete={(result) => applyRankingResult(result.resultado)}
          />
        )}
        {role === 'student' && page === 'ranking' && (
          <RankingPage
            rankingResults={rankingResults}
            generalRanking={generalRanking}
            lastRankingEvent={lastRankingEvent}
            onDemo={runRankingDemo}
          />
        )}
        {role === 'student' && page === 'historico' && <HistoryPage />}

        {role === 'professor' && page === 'prof-dashboard' && <ProfessorDashboard setPage={setPage} />}
        {role === 'professor' && page === 'prof-perguntas' && <QuestionBank />}
        {role === 'professor' && page === 'prof-ranking' && (
          <ProfessorRankingManager
            rankingResults={rankingResults}
            setRankingResults={setRankingResults}
            generalRanking={generalRanking}
            lastRankingEvent={lastRankingEvent}
            onDemo={runRankingDemo}
          />
        )}
        {role === 'professor' && page === 'prof-campeonato' && <CreateCampaign />}
      </main>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    role: 'student',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  function submitLogin(event) {
    event.preventDefault();

    const authenticated = onLogin(form);
    if (!authenticated) {
      setError('Usuario ou senha invalidos para o perfil selecionado.');
      return;
    }

    setError('');
  }

  return (
    <main className="login-screen">
      <section className="login-hero">
        <div className="gear-field" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p className="eyebrow">TorqueQuiz Arena</p>
        <h1>Duelo tecnico de Engenharia Mecanica</h1>
        <p>
          Acesse com seu perfil. Alunos entram apenas na arena de jogo; professores entram apenas
          no painel de acompanhamento e gestao.
        </p>

        <form className="login-form" onSubmit={submitLogin}>
          <div className="login-role-tabs" aria-label="Selecionar perfil">
            <button
              type="button"
              className={form.role === 'student' ? 'active' : ''}
              onClick={() => setForm({ ...form, role: 'student' })}
            >
              Aluno
            </button>
            <button
              type="button"
              className={form.role === 'professor' ? 'active' : ''}
              onClick={() => setForm({ ...form, role: 'professor' })}
            >
              Professor
            </button>
          </div>

          <label>
            Usuario
            <input
              autoComplete="username"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder={form.role === 'student' ? 'aluno' : 'professor'}
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="123"
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit">
            {form.role === 'student' ? 'Entrar como aluno' : 'Entrar como professor'}
          </button>

          <div className="login-help">
            <span>Aluno: aluno / 123</span>
            <span>Professor: professor / 123</span>
          </div>
        </form>
      </section>
    </main>
  );
}

function HomePage({ setPage, generalRanking, lastRankingEvent, onDemo }) {
  const stats = [
    { label: 'Regra de ranking', value: '3 / 1 / 0' },
    { label: 'Rodada atual', value: '4 de 8' },
    { label: 'Materias ativas', value: weeklySubjects.length },
    { label: 'Proximo bloco', value: weeklySubjects[0].name },
  ];

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-machine" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Liga 2026.1</p>
          <h1>X1 tecnico para Engenharia Mecanica</h1>
          <p>
            Disputas entre alunos com perguntas definidas pelos professores.
            O placar da partida vem dos acertos; o ranking usa sempre 3 pontos
            por vitoria, 1 por empate e 0 por derrota.
          </p>
        </div>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage('partida')}>Iniciar X1</button>
          <button className="btn-secondary" onClick={() => setPage('ranking')}>Ver ranking</button>
          <button className="btn-ghost" onClick={onDemo}>Demo ranking +3</button>
        </div>
      </section>

      {lastRankingEvent && <RankingEventBanner event={lastRankingEvent} />}

      <section className="metric-grid">
        {stats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Classificacao</h2>
          <button className="btn-ghost" onClick={() => setPage('ranking')}>Abrir completo</button>
        </div>
        <RankingTable rows={generalRanking.slice(0, 5)} highlightName={lastRankingEvent?.student} />
      </section>
    </div>
  );
}

function RankingPage({ rankingResults, generalRanking, lastRankingEvent, onDemo }) {
  const [selectedSubject, setSelectedSubject] = useState('geral');
  const selectedSubjectData = weeklySubjects.find((subject) => subject.id === selectedSubject);
  const rows = selectedSubject === 'geral'
    ? generalRanking
    : calculateSubjectRanking(rankingResults, selectedSubject);

  return (
    <div className="page-stack">
      <PageHeader
        title="Rankings da turma"
        subtitle="Geral soma todas as materias. Cada materia mantem sua propria classificacao."
      />

      <section className="leaderboard-spotlight">
        <div>
          <span>Leaderboard ao vivo</span>
          <strong>{generalRanking[0]?.nome}</strong>
          <small>{generalRanking[0]?.pontos} pontos no topo da liga</small>
        </div>
        <button className="btn-primary" onClick={onDemo}>Rodar teste de ranking</button>
      </section>

      {lastRankingEvent && <RankingEventBanner event={lastRankingEvent} />}

      <section className="schedule-grid">
        {weeklySubjects.map((subject) => (
          <button
            key={subject.id}
            className={selectedSubject === subject.id ? 'schedule-card active' : 'schedule-card'}
            onClick={() => setSelectedSubject(subject.id)}
          >
            <span>{subject.day}</span>
            <strong>{subject.name}</strong>
          </button>
        ))}
      </section>

      <section className="rank-tabs">
        <button className={selectedSubject === 'geral' ? 'active' : ''} onClick={() => setSelectedSubject('geral')}>
          Ranking geral
        </button>
        <span>
          {selectedSubject === 'geral'
            ? 'Soma calculada automaticamente: pontos = vitorias * 3 + empates.'
            : `${selectedSubjectData.day}: ${selectedSubjectData.name}`}
        </span>
      </section>

      <RankingTable rows={rows} highlightName={lastRankingEvent?.student} />
    </div>
  );
}

function RankingTable({ rows, highlightName }) {
  return (
    <div className="table-card leaderboard">
      <div className="table-row table-head">
        <span>Pos.</span>
        <span>Aluno</span>
        <span>V</span>
        <span>E</span>
        <span>D</span>
        <span>Pontos</span>
      </div>
      {rows.map((row) => (
        <div className={`table-row ${row.nome === highlightName ? 'updated' : ''}`} key={row.nome}>
          <span>#{row.rank}</span>
          <strong>{row.nome}</strong>
          <span>{row.vitorias}</span>
          <span>{row.empates}</span>
          <span>{row.derrotas}</span>
          <strong>{row.pontos}</strong>
        </div>
      ))}
    </div>
  );
}

function RankingEventBanner({ event }) {
  return (
    <section className="ranking-event">
      <span>Sistema validado</span>
      <strong>{event.student} recebeu atualizacao no ranking</strong>
      <small>{event.source} - resultado: {event.result}</small>
    </section>
  );
}

function HistoryPage() {
  return (
    <div className="page-stack">
      <PageHeader title="Historico de partidas" subtitle="Resultados recentes do aluno atual." />
      <div className="list">
        {mockHistoricoPartidas.map((match) => (
          <article className="list-item" key={match.id}>
            <div>
              <strong>{match.campeonato}</strong>
              <span>vs {match.adversario} - rodada {match.rodada}</span>
            </div>
            <div className="score-chip">
              {match.pontuacaoJogador} x {match.pontuacaoAdversario} | +{match.pontosRanking}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfessorDashboard({ setPage }) {
  return (
    <div className="page-stack">
      <PageHeader
        title="Painel do professor"
        subtitle="Controle os temas, perguntas e rodadas do campeonato."
      />
      <section className="metric-grid">
        <div className="metric-card"><span>Campeonatos ativos</span><strong>1</strong></div>
        <div className="metric-card"><span>Perguntas cadastradas</span><strong>48</strong></div>
        <div className="metric-card"><span>Materias no ranking</span><strong>{weeklySubjects.length}</strong></div>
        <div className="metric-card"><span>Regra</span><strong>3/1/0</strong></div>
      </section>
      <section className="action-grid">
        <button className="btn-primary" onClick={() => setPage('prof-perguntas')}>Gerenciar perguntas</button>
        <button className="btn-secondary" onClick={() => setPage('prof-ranking')}>Ajustar rankings</button>
        <button className="btn-secondary" onClick={() => setPage('prof-campeonato')}>Configurar campeonato</button>
      </section>
    </div>
  );
}

function ProfessorRankingManager({ rankingResults, setRankingResults, generalRanking, lastRankingEvent, onDemo }) {
  const [selectedSubject, setSelectedSubject] = useState(weeklySubjects[0].id);
  const selectedSubjectData = weeklySubjects.find((subject) => subject.id === selectedSubject);
  const subjectRanking = calculateSubjectRanking(rankingResults, selectedSubject);

  function updateRecord(studentId, field, value) {
    const parsedValue = Math.max(0, Number.parseInt(value, 10) || 0);

    setRankingResults((students) => students.map((student) => {
      if (student.studentId !== studentId) return student;

      const previousRecord = student.subjects[selectedSubject] || {
        vitorias: 0,
        empates: 0,
        derrotas: 0,
      };

      return {
        ...student,
        subjects: {
          ...student.subjects,
          [selectedSubject]: {
            ...previousRecord,
            [field]: parsedValue,
          },
        },
      };
    }));
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Rankings por materia"
        subtitle="Ajuste manual do professor. O sistema recalcula materia e geral com a regra 3/1/0."
      />

      <section className="leaderboard-spotlight professor-panel">
        <div>
          <span>Monitor de desempenho</span>
          <strong>Ranking recalculado automaticamente</strong>
          <small>Use o teste para comprovar que uma vitoria altera pontos, posicao e placar.</small>
        </div>
        <button className="btn-primary" onClick={onDemo}>Simular vitoria do aluno</button>
      </section>

      {lastRankingEvent && <RankingEventBanner event={lastRankingEvent} />}

      <section className="rank-tabs">
        <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)}>
          {weeklySubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.day} - {subject.name}</option>
          ))}
        </select>
        <span>{selectedSubjectData.name}: pontos = vitorias * 3 + empates</span>
      </section>

      <section className="editable-table">
        <div className="edit-row edit-head">
          <span>Aluno</span>
          <span>V</span>
          <span>E</span>
          <span>D</span>
          <span>Pontos</span>
        </div>
        {rankingResults.map((student) => {
          const record = student.subjects[selectedSubject] || { vitorias: 0, empates: 0, derrotas: 0 };
          const pontos = record.vitorias * 3 + record.empates;

          return (
            <div className="edit-row" key={student.studentId}>
              <strong>{student.nome}</strong>
              <input type="number" min="0" value={record.vitorias} onChange={(event) => updateRecord(student.studentId, 'vitorias', event.target.value)} />
              <input type="number" min="0" value={record.empates} onChange={(event) => updateRecord(student.studentId, 'empates', event.target.value)} />
              <input type="number" min="0" value={record.derrotas} onChange={(event) => updateRecord(student.studentId, 'derrotas', event.target.value)} />
              <strong>{pontos}</strong>
            </div>
          );
        })}
      </section>

      <section className="split-grid">
        <div>
          <div className="section-header">
            <h2>{selectedSubjectData.name}</h2>
          </div>
          <RankingTable rows={subjectRanking} highlightName={lastRankingEvent?.student} />
        </div>
        <div>
          <div className="section-header">
            <h2>Geral recalculado</h2>
          </div>
          <RankingTable rows={generalRanking} highlightName={lastRankingEvent?.student} />
        </div>
      </section>
    </div>
  );
}

function QuestionBank() {
  const [questions, setQuestions] = useState(baseQuestions);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    question: '',
    theme: 'Mecanica',
    difficulty: 'Medio',
  });

  function saveQuestion() {
    if (!form.question.trim()) return;

    if (editingId) {
      setQuestions((items) => items.map((item) => (
        item.id === editingId
          ? { ...item, question: form.question, theme: form.theme, difficulty: form.difficulty }
          : item
      )));
    } else {
      setQuestions((items) => [
        ...items,
        { id: Date.now(), question: form.question, theme: form.theme, difficulty: form.difficulty, uses: 0 },
      ]);
    }

    setEditingId(null);
    setForm({ question: '', theme: 'Mecanica', difficulty: 'Medio' });
  }

  function editQuestion(question) {
    setEditingId(question.id);
    setForm({
      question: question.question,
      theme: question.theme,
      difficulty: question.difficulty,
    });
  }

  return (
    <div className="page-stack">
      <PageHeader title="Banco de perguntas" subtitle="Temas que alimentam as disputas X1." />

      <section className="form-panel">
        <label>
          Pergunta
          <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        </label>
        <div className="form-row">
          <label>
            Tema
            <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
              <option>Mecanica</option>
              <option>Materiais</option>
              <option>Termodinamica</option>
              <option>Processos</option>
              <option>Metrologia</option>
            </select>
          </label>
          <label>
            Dificuldade
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option>Facil</option>
              <option>Medio</option>
              <option>Dificil</option>
            </select>
          </label>
        </div>
        <button className="btn-primary" onClick={saveQuestion}>
          {editingId ? 'Atualizar pergunta' : 'Salvar pergunta'}
        </button>
      </section>

      <section className="list">
        {questions.map((question) => (
          <article className="list-item" key={question.id}>
            <div>
              <strong>{question.question}</strong>
              <span>{question.theme} - {question.difficulty} - usado {question.uses}x</span>
            </div>
            <div className="row-actions">
              <button className="btn-ghost" onClick={() => editQuestion(question)}>Editar</button>
              <button className="btn-danger" onClick={() => setQuestions((items) => items.filter((item) => item.id !== question.id))}>
                Excluir
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function CreateCampaign() {
  const [campaign, setCampaign] = useState({
    name: 'Liga de Mecanica Aplicada 2026.1',
    rounds: 5,
    students: 'Joao, Marina, Rafael, Ana, Carlos, Julia',
  });
  const [rounds, setRounds] = useState([]);
  const [saved, setSaved] = useState(false);

  const students = useMemo(() => (
    campaign.students.split(',').map((student) => student.trim()).filter(Boolean)
  ), [campaign.students]);

  function generateMatches() {
    const generated = Array.from({ length: Number(campaign.rounds) || 1 }, (_, roundIndex) => {
      const rotated = [...students.slice(roundIndex), ...students.slice(0, roundIndex)];
      const matches = [];
      for (let i = 0; i < rotated.length; i += 2) {
        if (rotated[i + 1]) matches.push({ player1: rotated[i], player2: rotated[i + 1] });
      }
      return matches;
    });
    setRounds(generated);
    setSaved(false);
  }

  return (
    <div className="page-stack">
      <PageHeader title="Configurar campeonato" subtitle="Monte rodadas e confrontos para os alunos." />
      <section className="form-panel">
        <label>
          Nome
          <input value={campaign.name} onChange={(e) => setCampaign({ ...campaign, name: e.target.value })} />
        </label>
        <label>
          Alunos
          <textarea value={campaign.students} onChange={(e) => setCampaign({ ...campaign, students: e.target.value })} />
        </label>
        <label>
          Rodadas
          <input
            type="number"
            min="1"
            value={campaign.rounds}
            onChange={(e) => setCampaign({ ...campaign, rounds: e.target.value })}
          />
        </label>
        <div className="row-actions">
          <button className="btn-secondary" onClick={generateMatches}>Sortear confrontos</button>
          <button className="btn-primary" onClick={() => setSaved(true)} disabled={!rounds.length}>Criar campeonato</button>
        </div>
        {saved && <p className="inline-status">Campeonato criado com {rounds.length} rodadas.</p>}
      </section>

      {!!rounds.length && (
        <section className="list">
          {rounds.map((round, index) => (
            <article className="list-item vertical" key={index}>
              <strong>Rodada {index + 1}</strong>
              <div className="match-lines">
                {round.map((match) => (
                  <span key={`${match.player1}-${match.player2}`}>{match.player1} x {match.player2}</span>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <section className="page-header">
      <p className="eyebrow">TorqueQuiz</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}
