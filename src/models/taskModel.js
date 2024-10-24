// models/taskModel.js

const mongoose = require("mongoose");

// Definindo o esquema da tarefa
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // O título é obrigatório
  },
  description: {
    type: String,
    required: true, // A descrição é obrigatória
  },
  created_at: {
    type: Date,
    default: Date.now, // A data de criação padrão é a data atual
  },
});

// Criando o modelo
const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel; // Exportando o modelo para uso em outros arquivos


