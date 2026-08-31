import { useEffect, useState } from "react";
import FormTarefa from "./components/FormTarefa.jsx";
import ListaTarefas from "./components/ListaTarefas.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import {
  buscarTarefas,
  criarTarefa,
  excluirTarefa,
  atualizarStatus,
} from "./services/tarefaService.js";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarTarefas();
      setTarefas(dados);
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível carregar as tarefas. Verifique se o JSON Server está rodando.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function adicionarTarefa(titulo) {
    try {
      setErro("");

      const novaTarefa = await criarTarefa({
        titulo: titulo,
        concluida: false,
      });

      setTarefas((listaAtual) => [...listaAtual, novaTarefa]);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível cadastrar a tarefa.");
    }
  }

  async function removerTarefa(id) {
    // Pede confirmação antes de excluir
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta tarefa?",
    );

    // Se clicar em Cancelar, interrompe a função
    if (!confirmar) {
      return;
    }

    try {
      setErro("");

      // DELETE na API
      await excluirTarefa(id);

      // Remove a tarefa do estado
      setTarefas((listaAtual) =>
        listaAtual.filter((tarefa) => tarefa.id !== id),
      );
    } catch (error) {
      console.error(error);

      setErro("Não foi possível excluir a tarefa.");
    }
  }

  async function alterarTarefa(tarefa) {
    try {
      setErro("");

      const tarefaAtualizada = await atualizarStatus(
        tarefa.id,
        !tarefa.concluida,
      );

      setTarefas((listaAtual) =>
        listaAtual.map((item) =>
          item.id === tarefa.id ? tarefaAtualizada : item,
        ),
      );
    } catch (error) {
      console.error(error);
      setErro("Não foi possível alterar a tarefa.");
    }
  }

  return (
    <>
      <Header />

      <main className="container">
        <section className="apresentacao">
          <h1>Gerenciador de Tarefas</h1>

          <p>React consumindo uma API simulada com JSON Server</p>
        </section>

        <FormTarefa onAdicionar={adicionarTarefa} />

        {erro && <p className="erro">{erro}</p>}

        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <ListaTarefas
            tarefas={tarefas}
            onExcluir={removerTarefa}
            onAlterar={alterarTarefa}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
