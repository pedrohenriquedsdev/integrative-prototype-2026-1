export const mockQuestions = [
  {
    id: 1,
    pergunta: 'Qual expressao representa corretamente a segunda lei de Newton?',
    alternativas: [
      'F = m . a',
      'F = m / a',
      'F = a / m',
      'F = m . v',
    ],
    correta: 0,
    dificuldade: 'medio',
    categoria: 'Dinamica',
  },
  {
    id: 2,
    pergunta: 'Em um eixo circular, o torque e calculado a partir de qual relacao?',
    alternativas: [
      'Forca dividida pela massa',
      'Forca vezes o braco de alavanca perpendicular',
      'Pressao vezes volume',
      'Velocidade vezes aceleracao',
    ],
    correta: 1,
    dificuldade: 'facil',
    categoria: 'Mecanica',
  },
  {
    id: 3,
    pergunta: 'Qual e a unidade SI de torque?',
    alternativas: ['N', 'N.m', 'Pa', 'J/s'],
    correta: 1,
    dificuldade: 'facil',
    categoria: 'Unidades',
  },
  {
    id: 4,
    pergunta: 'O limite elastico de um material indica:',
    alternativas: [
      'A tensao maxima antes de deformacao permanente',
      'A temperatura de fusao',
      'A massa especifica',
      'A rugosidade media da superficie',
    ],
    correta: 0,
    dificuldade: 'medio',
    categoria: 'Materiais',
  },
  {
    id: 5,
    pergunta: 'Em transferencia de calor, conducao ocorre principalmente por:',
    alternativas: [
      'Contato molecular dentro do material',
      'Movimento de massa do fluido',
      'Ondas eletromagneticas no vacuo',
      'Mudanca de fase obrigatoria',
    ],
    correta: 0,
    dificuldade: 'medio',
    categoria: 'Termodinamica',
  },
  {
    id: 6,
    pergunta: 'Qual componente armazena energia mecanica por deformacao elastica?',
    alternativas: ['Mola', 'Rolamento', 'Engrenagem', 'Bucha'],
    correta: 0,
    dificuldade: 'facil',
    categoria: 'Elementos de Maquinas',
  },
  {
    id: 7,
    pergunta: 'Em um par de engrenagens, a relacao de transmissao depende principalmente:',
    alternativas: [
      'Da cor das engrenagens',
      'Do numero de dentes',
      'Da temperatura ambiente',
      'Do comprimento do eixo de entrada',
    ],
    correta: 1,
    dificuldade: 'medio',
    categoria: 'Elementos de Maquinas',
  },
  {
    id: 8,
    pergunta: 'O processo de recozimento e usado para:',
    alternativas: [
      'Reduzir tensoes internas e aumentar ductilidade',
      'Aumentar somente a rugosidade',
      'Medir torque em bancada',
      'Converter calor em trabalho diretamente',
    ],
    correta: 0,
    dificuldade: 'dificil',
    categoria: 'Processos',
  },
  {
    id: 9,
    pergunta: 'No diagrama tensao-deformacao, a regiao linear inicial segue:',
    alternativas: [
      'Lei de Hooke',
      'Lei de Fourier',
      'Lei de Ohm',
      'Equacao de Bernoulli',
    ],
    correta: 0,
    dificuldade: 'medio',
    categoria: 'Resistencia dos Materiais',
  },
  {
    id: 10,
    pergunta: 'Qual instrumento e adequado para medir torque em um aperto controlado?',
    alternativas: ['Paquimetro', 'Torquimetro', 'Manometro', 'Tacometro'],
    correta: 1,
    dificuldade: 'facil',
    categoria: 'Metrologia',
  },
];

export function getQuestionsForMatch(quantidade = 10) {
  return [...mockQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, quantidade);
}
