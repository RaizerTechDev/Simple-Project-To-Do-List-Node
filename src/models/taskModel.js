// taskModel.js

const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const async = require("async");

class TaskModel {
  constructor() {
    // Caminho para o arquivo do banco de dados
    const dbPath = path.resolve(__dirname, "../../db/database.sqlite");
    this.db = new sqlite3.Database(dbPath, { busyTimeout: 10000 }, (err) => {
      if (err) {
        console.error("Erro ao abrir o banco de dados:", err.message);
      } else {
        console.log("Conectado ao banco de dados SQLite");
        this.initTable();
      }
    });

    // Inicializa a fila para operações de banco de dados
    this.queue = async.queue((task, callback) => {
      task(callback);
    }, 1); // Apenas uma operação será executada por vez

    // Garante que a fila inicie automaticamente
    this.queue.drain(() => {
      console.log(
        "Tarefa adicionada com sucesso e as operações ao banco de dados concluídas"
      );
    });
  }

  initTable() {
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT  NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP            
            )
        `;
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Erro ao criar a tabela", err.message);
      } else {
        console.log("Tabela criada com sucesso");
      }
    });
  }

  async create(taskData) {
    const { title, description } = taskData;
    const insertQuery = "INSERT INTO tasks (title, description) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
      this.queue.push((callback) => {
        this.db.run(insertQuery, [title, description], function (err) {
          if (err) {
            console.error("Erro ao adicionar a tarefa:", err.message);
            reject(err);
          } else {
            resolve({ id: this.lastID, title, description });
          }
          callback(); // Sinaliza que a operação foi concluída
        });
      });
    });
  }

  getAll() {
    const selectQuery = "SELECT * FROM tasks";
    return new Promise((resolve, reject) => {
      this.queue.push((callback) => {
        this.db.all(selectQuery, (err, rows) => {
          if (err) {
            console.error("Erro ao obter todas as tarefas:", err.message);
            reject(err);
          } else {
            resolve(rows);
          }
          callback(); // Sinaliza que a operação foi concluída
        });
      });
    });
  }
}

module.exports = TaskModel;
