export const mockCampeonatos = [
  {
    id: 1,
    nome: 'Liga de Mecanica Aplicada 2026.1',
    curso: 'Engenharia Mecanica',
    rodada: 4,
    totalRodadas: 8,
    dataInicio: '2026-02-10',
    dataFim: '2026-06-30',
    ativa: true,
    descricao: 'Disputas X1 com temas definidos pelos professores.',
  },
];

export const weeklySubjects = [
  { id: 'calculo-numerico', name: 'Calculo numerico', day: 'Segunda' },
  { id: 'termodinamica', name: 'Termodinamica', day: 'Terca' },
  { id: 'desenho-industrial', name: 'Desenho industrial', day: 'Quarta' },
  { id: 'praticas-extensionistas', name: 'Praticas extensionistas', day: 'Quinta' },
  { id: 'lingua-portuguesa', name: 'Lingua portuguesa', day: 'Sexta' },
  { id: 'equacoes-diferenciais', name: 'Equacoes diferenciais', day: 'Sexta' },
];

export const subjectResults = [
  {
    studentId: 'marina',
    nome: 'Marina Costa',
    subjects: {
      'calculo-numerico': { vitorias: 6, empates: 1, derrotas: 1 },
      termodinamica: { vitorias: 5, empates: 2, derrotas: 1 },
      'desenho-industrial': { vitorias: 4, empates: 2, derrotas: 2 },
      'praticas-extensionistas': { vitorias: 5, empates: 1, derrotas: 2 },
      'lingua-portuguesa': { vitorias: 3, empates: 1, derrotas: 3 },
      'equacoes-diferenciais': { vitorias: 2, empates: 0, derrotas: 2 },
    },
  },
  {
    studentId: 'rafael',
    nome: 'Rafael Mendes',
    subjects: {
      'calculo-numerico': { vitorias: 5, empates: 2, derrotas: 1 },
      termodinamica: { vitorias: 6, empates: 0, derrotas: 2 },
      'desenho-industrial': { vitorias: 3, empates: 2, derrotas: 3 },
      'praticas-extensionistas': { vitorias: 4, empates: 2, derrotas: 2 },
      'lingua-portuguesa': { vitorias: 3, empates: 1, derrotas: 3 },
      'equacoes-diferenciais': { vitorias: 2, empates: 0, derrotas: 2 },
    },
  },
  {
    studentId: 'ana',
    nome: 'Ana Silva',
    subjects: {
      'calculo-numerico': { vitorias: 4, empates: 2, derrotas: 2 },
      termodinamica: { vitorias: 4, empates: 1, derrotas: 3 },
      'desenho-industrial': { vitorias: 5, empates: 1, derrotas: 2 },
      'praticas-extensionistas': { vitorias: 4, empates: 1, derrotas: 3 },
      'lingua-portuguesa': { vitorias: 3, empates: 1, derrotas: 3 },
      'equacoes-diferenciais': { vitorias: 1, empates: 0, derrotas: 3 },
    },
  },
  {
    studentId: 'carlos',
    nome: 'Carlos Oliveira',
    subjects: {
      'calculo-numerico': { vitorias: 3, empates: 2, derrotas: 3 },
      termodinamica: { vitorias: 4, empates: 1, derrotas: 3 },
      'desenho-industrial': { vitorias: 4, empates: 2, derrotas: 2 },
      'praticas-extensionistas': { vitorias: 3, empates: 1, derrotas: 4 },
      'lingua-portuguesa': { vitorias: 3, empates: 1, derrotas: 3 },
      'equacoes-diferenciais': { vitorias: 1, empates: 0, derrotas: 3 },
    },
  },
  {
    studentId: 'joao',
    nome: 'Joao Silva',
    subjects: {
      'calculo-numerico': { vitorias: 4, empates: 1, derrotas: 3 },
      termodinamica: { vitorias: 3, empates: 2, derrotas: 3 },
      'desenho-industrial': { vitorias: 3, empates: 1, derrotas: 4 },
      'praticas-extensionistas': { vitorias: 4, empates: 1, derrotas: 3 },
      'lingua-portuguesa': { vitorias: 2, empates: 2, derrotas: 3 },
      'equacoes-diferenciais': { vitorias: 1, empates: 0, derrotas: 3 },
    },
  },
  {
    studentId: 'julia',
    nome: 'Julia Ferreira',
    subjects: {
      'calculo-numerico': { vitorias: 3, empates: 1, derrotas: 4 },
      termodinamica: { vitorias: 3, empates: 1, derrotas: 4 },
      'desenho-industrial': { vitorias: 4, empates: 0, derrotas: 4 },
      'praticas-extensionistas': { vitorias: 3, empates: 1, derrotas: 4 },
      'lingua-portuguesa': { vitorias: 1, empates: 3, derrotas: 3 },
      'equacoes-diferenciais': { vitorias: 1, empates: 0, derrotas: 3 },
    },
  },
];

export function calculatePoints(record = {}) {
  return (Number(record.vitorias) || 0) * 3 + (Number(record.empates) || 0);
}

function compareRanking(a, b) {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos;
  if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
  if (a.derrotas !== b.derrotas) return a.derrotas - b.derrotas;
  return a.nome.localeCompare(b.nome);
}

export function calculateSubjectRanking(results, subjectId) {
  return results
    .map((student) => {
      const record = student.subjects[subjectId] || {};
      return {
        studentId: student.studentId,
        nome: student.nome,
        vitorias: Number(record.vitorias) || 0,
        empates: Number(record.empates) || 0,
        derrotas: Number(record.derrotas) || 0,
        pontos: calculatePoints(record),
      };
    })
    .sort(compareRanking)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function calculateGeneralRanking(results) {
  return results
    .map((student) => {
      const totals = Object.values(student.subjects).reduce((acc, record) => ({
        vitorias: acc.vitorias + (Number(record.vitorias) || 0),
        empates: acc.empates + (Number(record.empates) || 0),
        derrotas: acc.derrotas + (Number(record.derrotas) || 0),
        pontos: acc.pontos + calculatePoints(record),
      }), { vitorias: 0, empates: 0, derrotas: 0, pontos: 0 });

      return { studentId: student.studentId, nome: student.nome, ...totals };
    })
    .sort(compareRanking)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export const mockAdversarios = [
  { id: 1, nome: 'Marina Costa', ranking: 1, pontos: 82, nivel: 'Avancado', winrate: 0.78 },
  { id: 2, nome: 'Rafael Mendes', ranking: 2, pontos: 76, nivel: 'Avancado', winrate: 0.74 },
  { id: 3, nome: 'Ana Silva', ranking: 3, pontos: 69, nivel: 'Intermediario', winrate: 0.68 },
  { id: 4, nome: 'Carlos Oliveira', ranking: 4, pontos: 62, nivel: 'Intermediario', winrate: 0.64 },
  { id: 5, nome: 'Julia Ferreira', ranking: 6, pontos: 51, nivel: 'Intermediario', winrate: 0.6 },
];

export const mockRanking = calculateGeneralRanking(subjectResults);

export const mockHistoricoPartidas = [
  {
    id: 1,
    adversario: 'Rafael Mendes',
    resultado: 'vitoria',
    pontuacaoJogador: 8,
    pontuacaoAdversario: 5,
    pontosRanking: 3,
    data: '2026-05-26',
    rodada: 3,
    campeonato: 'Liga de Mecanica Aplicada 2026.1',
  },
  {
    id: 2,
    adversario: 'Ana Silva',
    resultado: 'derrota',
    pontuacaoJogador: 6,
    pontuacaoAdversario: 9,
    pontosRanking: 0,
    data: '2026-05-24',
    rodada: 3,
    campeonato: 'Liga de Mecanica Aplicada 2026.1',
  },
  {
    id: 3,
    adversario: 'Carlos Oliveira',
    resultado: 'empate',
    pontuacaoJogador: 7,
    pontuacaoAdversario: 7,
    pontosRanking: 1,
    data: '2026-05-22',
    rodada: 2,
    campeonato: 'Liga de Mecanica Aplicada 2026.1',
  },
];

export const mockJogadorAtual = {
  id: 'user_1',
  nome: 'Joao Silva',
  ranking: 5,
  pontos: 58,
  vitorias: 17,
  empates: 7,
  derrotas: 12,
  nivel: 'Intermediario',
  curso: 'Engenharia Mecanica',
};

export function getAdversarioAleatorio() {
  const adversarios = mockAdversarios.filter((a) => a.nome !== mockJogadorAtual.nome);
  return adversarios[Math.floor(Math.random() * adversarios.length)];
}

export function getCampeonatoAtivo() {
  return mockCampeonatos.find((c) => c.ativa) || mockCampeonatos[0];
}
