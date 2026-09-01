function ListaTarefas({ tarefas, onExcluir, onAlterar }) {
  if (tarefas.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <section className="lista">
      {tarefas.map((tarefa) => (
        <article className="tarefa" key={tarefa.id}>
          <div>
            <h2 className={tarefa.concluida ? "concluida" : ""}>
              {tarefa.titulo}
            </h2>

            <span>
              {tarefa.concluida ? "Concluída" : "Pendente"}
            </span>
          </div>

          <div className="acoes">
            <button
              type="button"
              onClick={() => onAlterar(tarefa)}
            >
              {tarefa.concluida ? "Reabrir" : "Concluir"}
            </button>

            <button
              type="button"
              className="botao-excluir"
              onClick={() => onExcluir(tarefa.id)}
            >
              Excluir
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ListaTarefas;
