import { CodeXml, Database, Settings, Command, Cpu, type LucideIcon } from "lucide-react";

export type Tone = "violet" | "electric" | "lime" | "amber" | "cyan" | "magenta";

/** Classes for each accent tone, written as literals so Tailwind keeps them. */
export const tones: Record<Tone, { tile: string; text: string; bar: string; dot: string }> = {
  violet: { tile: "bg-violet/15 text-violet", text: "text-violet", bar: "bg-violet", dot: "bg-violet" },
  electric: { tile: "bg-electric/15 text-electric", text: "text-electric", bar: "bg-electric", dot: "bg-electric" },
  lime: { tile: "bg-lime/15 text-lime", text: "text-lime", bar: "bg-lime", dot: "bg-lime" },
  amber: { tile: "bg-amber/15 text-amber", text: "text-amber", bar: "bg-amber", dot: "bg-amber" },
  cyan: { tile: "bg-cyan/15 text-cyan", text: "text-cyan", bar: "bg-cyan", dot: "bg-cyan" },
  magenta: { tile: "bg-magenta/15 text-magenta", text: "text-magenta", bar: "bg-magenta", dot: "bg-magenta" },
};

export type Subject = { slug: string; name: string; icon: LucideIcon; tone: Tone; progress: number; favorite: boolean; updated: number };
export type Aula = { slug: string; subject: string; num: string; title: string; date: string };
export type Note = {
  slug: string;
  subject: string;
  aula: string;
  title: string;
  date: string;
  time: string;
  preview: string;
  content: string;
  concepts: string[];
  code?: string[];
};

export const subjects: Subject[] = [
  { slug: "programacao", name: "Programação", icon: CodeXml, tone: "violet", progress: 75, favorite: true, updated: 5 },
  { slug: "banco-de-dados", name: "Banco de dados", icon: Database, tone: "electric", progress: 50, favorite: false, updated: 4 },
  { slug: "engenharia-de-software", name: "Engenharia de software", icon: Settings, tone: "lime", progress: 33, favorite: false, updated: 3 },
  { slug: "redes-de-computadores", name: "Redes de computadores", icon: Command, tone: "amber", progress: 0, favorite: false, updated: 1 },
  { slug: "sistemas-operacionais", name: "Sistemas operacionais", icon: Cpu, tone: "cyan", progress: 0, favorite: false, updated: 2 },
];

export const aulas: Aula[] = [
  { slug: "aula-01", subject: "programacao", num: "01", title: "Introdução à lógica", date: "12 set. 2026" },
  { slug: "aula-02", subject: "programacao", num: "02", title: "Estruturas de dados", date: "15 set. 2026" },
  { slug: "aula-03", subject: "programacao", num: "03", title: "Orientação a objetos", date: "18 set. 2026" },
  { slug: "aula-04", subject: "programacao", num: "04", title: "Tratamento de erros", date: "22 set. 2026" },
  { slug: "aula-05", subject: "programacao", num: "05", title: "Projeto prático", date: "26 set. 2026" },
  { slug: "aula-01", subject: "banco-de-dados", num: "01", title: "Modelagem e DER", date: "10 set. 2026" },
  { slug: "aula-02", subject: "banco-de-dados", num: "02", title: "SQL e JOINs", date: "17 set. 2026" },
  { slug: "aula-01", subject: "engenharia-de-software", num: "01", title: "Requisitos e análise", date: "11 set. 2026" },
];

export const notes: Note[] = [
  {
    slug: "o-que-e-logica",
    subject: "programacao",
    aula: "aula-01",
    title: "O que é lógica de programação?",
    date: "12 set. 2026",
    time: "10:24",
    preview: "Conceitos básicos sobre lógica, variáveis e algoritmos.",
    content:
      "A lógica de programação é a base para a construção de qualquer sistema. Ela envolve o pensamento estruturado para resolver problemas, utilizando sequências de instruções, condições e repetições.",
    concepts: ["Variáveis", "Operadores", "Estruturas condicionais", "Laços de repetição"],
    code: ["if (idade >= 18) {", "  print('Maior de idade');", "} else {", "  print('Menor de idade');", "}"],
  },
  {
    slug: "estruturas-condicionais",
    subject: "programacao",
    aula: "aula-01",
    title: "Estruturas condicionais",
    date: "12 set. 2026",
    time: "14:37",
    preview: "if, else, switch e suas aplicações.",
    content: "Estruturas condicionais permitem que o programa tome decisões, executando blocos diferentes conforme uma condição é verdadeira ou falsa.",
    concepts: ["if / else", "else if encadeado", "switch / case", "Operador ternário"],
    code: ["switch (dia) {", "  case 1: print('Domingo'); break;", "  default: print('Outro dia');", "}"],
  },
  {
    slug: "lacos-de-repeticao",
    subject: "programacao",
    aula: "aula-01",
    title: "Laços de repetição",
    date: "13 set. 2026",
    time: "09:15",
    preview: "For, while, do-while e exemplos práticos.",
    content: "Laços repetem um bloco de instruções enquanto uma condição for verdadeira. São usados para percorrer listas, contar e processar dados.",
    concepts: ["for", "while", "do-while", "break e continue"],
    code: ["for (let i = 1; i <= 5; i++) {", "  print(i);", "}"],
  },
  {
    slug: "vetores-e-listas",
    subject: "programacao",
    aula: "aula-02",
    title: "Vetores e listas",
    date: "15 set. 2026",
    time: "19:30",
    preview: "Como armazenar vários valores em uma única estrutura.",
    content: "Vetores guardam elementos em posições numeradas. Listas podem crescer e diminuir conforme a necessidade do programa.",
    concepts: ["Índices", "Tamanho", "Inserção e remoção", "Percorrer com laços"],
  },
  {
    slug: "pilhas-e-filas",
    subject: "programacao",
    aula: "aula-02",
    title: "Pilhas e filas",
    date: "15 set. 2026",
    time: "20:10",
    preview: "LIFO e FIFO na prática.",
    content: "Pilhas seguem a regra do último a entrar, primeiro a sair. Filas seguem a regra do primeiro a entrar, primeiro a sair.",
    concepts: ["push / pop", "enqueue / dequeue", "Casos de uso"],
  },
  {
    slug: "classes-e-objetos",
    subject: "programacao",
    aula: "aula-03",
    title: "Classes e objetos",
    date: "18 set. 2026",
    time: "19:20",
    preview: "Atributos, métodos e instâncias.",
    content: "Uma classe é um molde; um objeto é uma instância desse molde, com seus próprios valores de atributos.",
    concepts: ["Atributos", "Métodos", "Construtor", "Encapsulamento"],
  },
  {
    slug: "entidades-e-relacionamentos",
    subject: "banco-de-dados",
    aula: "aula-01",
    title: "Entidades e relacionamentos",
    date: "10 set. 2026",
    time: "21:05",
    preview: "Como representar o mundo real em um DER.",
    content: "O Diagrama Entidade-Relacionamento descreve as entidades do sistema, seus atributos e como elas se relacionam.",
    concepts: ["Entidade", "Atributo", "Cardinalidade", "Chave primária"],
  },
  {
    slug: "inner-join",
    subject: "banco-de-dados",
    aula: "aula-02",
    title: "INNER JOIN na prática",
    date: "17 set. 2026",
    time: "20:40",
    preview: "Combinando registros de duas tabelas.",
    content: "O INNER JOIN retorna apenas as linhas que têm correspondência nas duas tabelas envolvidas.",
    concepts: ["Chave estrangeira", "Condição ON", "Aliases"],
    code: ["SELECT a.nome, c.titulo", "FROM alunos a", "INNER JOIN cursos c ON c.id = a.curso_id;"],
  },
  {
    slug: "left-e-right-join",
    subject: "banco-de-dados",
    aula: "aula-02",
    title: "LEFT e RIGHT JOIN",
    date: "17 set. 2026",
    time: "21:15",
    preview: "Quando manter linhas sem correspondência.",
    content: "LEFT JOIN mantém todas as linhas da tabela da esquerda; RIGHT JOIN, todas as da direita.",
    concepts: ["Valores NULL", "Diferença para INNER", "Armadilhas comuns"],
  },
  {
    slug: "funcionais-vs-nao-funcionais",
    subject: "engenharia-de-software",
    aula: "aula-01",
    title: "Requisitos funcionais e não funcionais",
    date: "11 set. 2026",
    time: "20:33",
    preview: "O que o sistema faz e como ele deve se comportar.",
    content: "Requisitos funcionais descrevem o que o sistema faz. Não funcionais descrevem qualidades como desempenho, segurança e usabilidade.",
    concepts: ["Funcionais", "Não funcionais", "Critérios de aceite"],
  },
  {
    slug: "levantamento",
    subject: "engenharia-de-software",
    aula: "aula-01",
    title: "Técnicas de levantamento",
    date: "11 set. 2026",
    time: "21:02",
    preview: "Entrevistas, questionários e observação.",
    content: "O levantamento de requisitos reúne informações com usuários e clientes para entender o problema antes de construir a solução.",
    concepts: ["Entrevistas", "Questionários", "Observação", "Prototipação"],
  },
];

export const getSubject = (slug: string) => subjects.find((s) => s.slug === slug);
export const subjectAulas = (slug: string) => aulas.filter((a) => a.subject === slug);
export const subjectNotes = (slug: string) => notes.filter((n) => n.subject === slug);
export const getAula = (subject: string, slug: string) => aulas.find((a) => a.subject === subject && a.slug === slug);
export const aulaNotes = (subject: string, aula: string) => notes.filter((n) => n.subject === subject && n.aula === aula);
export const getNote = (subject: string, aula: string, slug: string) =>
  notes.find((n) => n.subject === subject && n.aula === aula && n.slug === slug);

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
