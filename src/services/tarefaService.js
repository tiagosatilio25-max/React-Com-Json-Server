const URL_API = "http://localhost:3000/tarefas";

export async function buscarTarefas() {
  const resposta = await fetch(URL_API);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar tarefas");
  }

  return await resposta.json();
}

export async function criarTarefa(tarefa) {
  const resposta = await fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarefa),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao criar tarefa");
  }

  return await resposta.json();
}

export async function excluirTarefa(id) {
  const resposta = await fetch(`${URL_API}/${id}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    throw new Error("Erro ao excluir tarefa");
  }
}

export async function atualizarStatus(id, concluida) {
  const resposta = await fetch(`${URL_API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      concluida,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }

  return await resposta.json();
}
