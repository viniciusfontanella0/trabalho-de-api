
let tarefas = [
  {
    id: 1,
    titulo: "Estudar Express",
    descricao: "Ler a documentação oficial do Express e testar rotas simples",
    prioridade: "alta",
    concluida: false,
    dataCriacao: new Date("2026-09-01T09:00:00").toISOString(),
  },
  {
    id: 2,
    titulo: "Organizar anotações da faculdade",
    descricao: "Revisar o conteúdo de POO em JavaScript e Java",
    prioridade: "media",
    concluida: true,
    dataCriacao: new Date("2026-09-05T14:30:00").toISOString(),
  },
  {
    id: 3,
    titulo: "Praticar Git",
    descricao: "Treinar commits pequenos e mensagens descritivas",
    prioridade: "baixa",
    concluida: false,
    dataCriacao: new Date("2026-09-10T18:15:00").toISOString(),
  },
];

let proximoId = 4;
function getProximoId() {
  return proximoId++;
}

module.exports = { tarefas, getProximoId };
