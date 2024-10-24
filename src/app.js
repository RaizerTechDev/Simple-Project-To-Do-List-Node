// app.js
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Importando o modelo TaskModel
const TaskModel = require("./models/taskModel"); 

// Importando o serviço de arquivo
const { saveTaskToFile } = require("./file/fileService");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Conexão com o MongoDB Atlas
console.log("MONGODB_URI:", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  });

app.post("/add-task", async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).send(`
            <h2>Task title is required.</h2>
            <button class="add-task__button" onclick="history.back()">Come_Back</button>
        `);
  }

  try {
    const task = new TaskModel({ title, description });
    await task.save(); // Salva no MongoDB

    // Salva a tarefa no arquivo JSON
    saveTaskToFile({ title, description });

    res.status(201).send(`
        <h2>Task successfully added to database!!</h2>
        <button class="add-task__button" onclick="history.back()">Add-New-Task</button>
        `);
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    res.status(500).send(`
        <h2>An error occurred while adding the task.</h2>
        <button class="add-task__button" onclick="history.back()">Come_Back</button>
        `);
  }
});

app.get("/", (req, res) => {
  console.log('Recebida solicitação para "/"');
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
