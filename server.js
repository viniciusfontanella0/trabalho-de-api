const express = require("express");
const tarefasService = require("./servicos/tarefasService");
const app = express();
const PORTA = 3000;

app.use(express.json());

app.use((req, res, next) => {
  const agora = new Date().toLocaleString("pt-BR");
  console.log(`[${agora}] ${req.method} ${req.originalUrl}`);
  next();
});


app.get("/tarefas", (req, res) => {
  const { prioridade, concluida, busca, ordenarPor } = req.query;

  const filtros = {};
  if (prioridade) filtros.prioridade = prioridade;
  if (busca) filtros.busca = busca;
  if (ordenarPor) filtros.ordenarPor = ordenarPor;

  if (concluida !== undefined) {
    if (concluida !== "true" && concluida !== "false") {
      return res.status(400).json({
        erro: "O parâmetro concluida deve ser 'true' ou 'false'.",
      });
    }
    filtros.concluida = concluida === "true";
  }

  const resultado = tarefasService.listarTarefas(filtros);
  res.status(200).json(resultado);
});

app.get("/tarefas/estatisticas", (req, res) => {
  const estatisticas = tarefasService.obterEstatisticas();
  res.status(200).json(estatisticas);
});


app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id informado precisa ser numérico." });
  }

  const tarefa = tarefasService.buscarTarefaPorId(id);

  if (!tarefa) {
    return res.status(404).json({ erro: `Tarefa com id ${id} não foi encontrada.` });
  }

  res.status(200).json(tarefa);
});

// POST /tarefas -> cria uma nova tarefa
app.post("/tarefas", (req, res) => {
  const { titulo, descricao, prioridade } = req.body;

  const erros = tarefasService.validarCamposCriacao({ titulo, descricao, prioridade });
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const novaTarefa = tarefasService.criarTarefa({ titulo, descricao, prioridade });
  res.status(201).json(novaTarefa);
});

app.patch("/tarefas/:id/concluir", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id informado precisa ser numérico." });
  }

  const tarefaAtualizada = tarefasService.atualizarTarefa(id, { concluida: true });

  if (!tarefaAtualizada) {
    return res.status(404).json({ erro: `Tarefa com id ${id} não foi encontrada.` });
  }

  res.status(200).json(tarefaAtualizada);
});

app.patch("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id informado precisa ser numérico." });
  }

  const tarefaExistente = tarefasService.buscarTarefaPorId(id);
  if (!tarefaExistente) {
    return res.status(404).json({ erro: `Tarefa com id ${id} não foi encontrada.` });
  }

  const { titulo, descricao, prioridade, concluida } = req.body;
  const erros = tarefasService.validarCamposAtualizacao({
    titulo,
    descricao,
    prioridade,
    concluida,
  });

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const tarefaAtualizada = tarefasService.atualizarTarefa(id, {
    titulo,
    descricao,
    prioridade,
    concluida,
  });

  res.status(200).json(tarefaAtualizada);
});

app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "O id informado precisa ser numérico." });
  }

  const tarefaExistente = tarefasService.buscarTarefaPorId(id);
  if (!tarefaExistente) {
    return res.status(404).json({ erro: `Tarefa com id ${id} não foi encontrada.` });
  }

  tarefasService.removerTarefa(id);
  res.status(200).json({ mensagem: `Tarefa com id ${id} removida com sucesso.` });
});


app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
