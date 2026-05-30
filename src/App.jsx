import { useMemo, useState } from 'react';
import MatchPage from './components/MatchPage';
import {
  calculateGeneralRanking,
  calculateSubjectRanking,
  mockHistoricoPartidas,
  mockJogadorAtual,
  mockRanking,
  subjectResults,
  weeklySubjects,
} from './data/mockMatches';

const baseQuestions = [
  { id: 1, question: 'Explique o conceito de torque.', theme: 'Mecanica', difficulty: 'Medio', uses: 12 },
  { id: 2, question: 'Quando ocorre deformacao plastica?', theme: 'Materiais', difficulty: 'Medio', uses: 9 },
  { id: 3, question: 'Defina conducao termica.', theme: 'Termodinamica', difficulty: 'Facil', uses: 15 },
];

export default function App() {
  const [page, setPage] = useState('inicio');
  const [role, setRole] = useState('student');
  const [rankingResults, setRankingResults] = useState(subjectResults);

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

  function switchRole(nextRole) {
    setRole(nextRole);
    setPage(nextRole === 'student' ? 'inicio' : 'prof-dashboard');
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

        <div className="role-switcher" aria-label="Alternar perfil">
          <button className={role === 'student' ? 'active' : ''} onClick={() => switchRole('student')}>
            Aluno
          </button>
          <button className={role === 'professor' ? 'active' : ''} onClick={() => switchRole('professor')}>
            Professor
          </button>
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
          <span>{role === 'student' ? mockJogadorAtual.nome : 'Prof. Carlos Eduardo'}</span>
          <strong>{role === 'student' ? `#${generalRanking.find((row) => row.nome === mockJogadorAtual.nome)?.rank || '-'} - ${generalRanking.find((row) => row.nome === mockJogadorAtual.nome)?.pontos || 0} pts` : 'Banco de temas'}</strong>
        </div>
      </aside>

      <main className="content">
        {role === 'student' && page === 'inicio' && <HomePage setPage={setPage} generalRanking={generalRanking} />}
        {role === 'student' && page === 'partida' && <MatchPage setPage={setPage} />}
        {role === 'student' && page === 'ranking' && <RankingPage rankingResults={rankingResults} generalRanking={generalRanking} />}
        {role === 'student' && page === 'historico' && <HistoryPage />}

        {role === 'professor' && page === 'prof-dashboard' && <ProfessorDashboard setPage={setPage} />}
        {role === 'professor' && page === 'prof-perguntas' && <QuestionBank />}
        {role === 'professor' && page === 'prof-ranking' && (
          <ProfessorRankingManager
            rankingResults={rankingResults}
            setRankingResults={setRankingResults}
            generalRanking={generalRanking}
          />
        )}
        {role === 'professor' && page === 'prof-campeonato' && <CreateCampaign />}
      </main>
    </div>
  );
}

function HomePage({ setPage, generalRanking }) {
  const stats = [
    { label: 'Regra de ranking', value: '3 / 1 / 0' },
    { label: 'Rodada atual', value: '4 de 8' },
    { label: 'Materias ativas', value: weeklySubjects.length },
    { label: 'Proximo bloco', value: weeklySubjects[0].name },
  ];

  return (
    <div className="page-stack">
      <section className="hero-panel">
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
        </div>
      </section>

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
        <RankingTable rows={generalRanking.slice(0, 5)} />
      </section>
    </div>
  );
}

function RankingPage({ rankingResults, generalRanking }) {
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

      <RankingTable rows={rows} />
    </div>
  );
}

function RankingTable({ rows }) {
  return (
    <div className="table-card">
      <div className="table-row table-head">
        <span>Pos.</span>
        <span>Aluno</span>
        <span>V</span>
        <span>E</span>
        <span>D</span>
        <span>Pontos</span>
      </div>
      {rows.map((row) => (
        <div className="table-row" key={row.nome}>
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

function ProfessorRankingManager({ rankingResults, setRankingResults, generalRanking }) {
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
          <RankingTable rows={subjectRanking} />
        </div>
        <div>
          <div className="section-header">
            <h2>Geral recalculado</h2>
          </div>
          <RankingTable rows={generalRanking} />
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
