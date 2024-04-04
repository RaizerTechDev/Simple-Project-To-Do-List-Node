// app.js

const express = require("express");
const app = express();
const path = require("path");

// Corrigir o caminho para a importação do TaskModel
const TaskModel = require("./models/taskModel");

app.use(express.urlencoded({ extended: true }));

// Configura o servidor para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/add-task", async (req, res) => {
  const { title, description } = req.body;

  // Verifica se o título da tarefa não está vazio
  // Envie uma resposta ao cliente com um botão
  if (!title) {
    return res.status(400).send(`
        <h2>Task title is required.</h2>
        <button class="add-task__button" onclick="history.back()">Come_Back</button>
    `);
  }

  try {
    // Adiciona a tarefa ao banco de dados usando o modelo TaskModel
    const taskModel = new TaskModel(); // Criar uma instância do TaskModel
    await taskModel.create({ title, description }); // Chamar o método create

    // Responde ao cliente com uma mensagem de sucesso
    // Envie uma resposta ao cliente com um botão
    res.status(201).send(`
    <h2>Task successfully added to database!!</h2>
    <button class="add-task__button" onclick="history.back()">Add-New-Task</button>
`);
  } catch (error) {
    // Se ocorrer um erro, responde ao cliente com uma mensagem de erro
    console.error("Erro ao adicionar tarefa:", error);
    res.status(500).send(`
    <h2>An error occurred while adding the task.</h2>
    <button class="add-task__button" onclick="history.back()">Come_Back</button>
    `);
  }
});

app.get("/", (req, res) => {
  console.log('Recebida solicitação para "/"');
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
