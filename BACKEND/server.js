const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORTA = 3000;
const CAMINHO_ARQUIVO = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

function lerBanco() {
  try {
    const dados = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
    return JSON.parse(dados);
  } catch (error) {
    console.error("erro ao ler o json", error);
  }
}

function salvarBanco(dados) {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}

app.get("/tarefas", (req, res) => {
  try {
    const tarefas = lerBanco();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao ler as tarefas" });
  }
});

app.post("/tarefas", (req, res) => {
  try {
    const tarefas = lerBanco();

    const novaTarefa = {
      id: Date.now(),
      titulo: req.body.titulo,
      concluida: false,
    };

    tarefas.push(novaTarefa);
    salvarBanco(tarefas);

    res.status(201).json(novaTarefa);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cria tarefa" });
  }
});


app.patch("/tarefas/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { concluida } = req.body;
    const tarefas = lerBanco();

    const tarefa = tarefas.find((t) => t.id == id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    if (concluida !== undefined) {
      tarefa.concluida = concluida;
    }

    salvarBanco(tarefas);
    res.json(tarefa);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
});

app.delete("/tarefas/:id", (req, res) => {
  try {
    const { id } = req.params;
    let tarefas = lerBanco();

    const tamanhoInicial = tarefas.length;

    tarefas = tarefas.filter((t) => t.id != id);

    if (tarefas.length === tamanhoInicial) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    salvarBanco(tarefas);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir tarefa" });
  }
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhos:${PORTA}`);
});
