// file/fileService.js
const fs = require("fs");
const path = require("path");

// Caminho do arquivo JSON
const filePath = path.join(__dirname, "../data/tasks.json");

// Função para salvar uma tarefa no arquivo JSON
const saveTaskToFile = (task) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    let tasks = [];
    if (!err && data) {
      tasks = JSON.parse(data);
    }

    // Adiciona a nova tarefa ao array
    tasks.push(task);

    // Escreve o array de volta no arquivo JSON
    fs.writeFile(filePath, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        console.error("Erro ao salvar a tarefa no arquivo JSON:", err);
      } else {
        console.log("Tarefa salva no arquivo JSON com sucesso!");
      }
    });
  });
};

// Função para ler todas as tarefas do arquivo JSON (opcional)
const getTasksFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler o arquivo JSON:", err);
    return [];
  }
};

module.exports = {
  saveTaskToFile,
  getTasksFromFile,
};
