import { useEffect, useState } from "react";
import FormTarefa from "./components/FormTarefa.jsx";
import ListaTarefas from "./components/ListaTarefas.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import {
    buscarTarefas,
    criarTarefa,
    excluirTarefa,
    atulizarStatus
} from "./services/tarefaService.js"

function App(){
    const [tarefas, setTarefas] = useState([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando]= useState(true);
     
    useEffect(() => {
        carregarTarefas();
         },
    );


    async function carregarTarefas() {

        try{
            setCarregando(true);
            setErro("");

            const dados = await buscarTarefas();
            setTarefas(dados);
        }   catch (error) {
            console.error(error);
            setErro(
                "Não foi possível carregar as tarefas. Verique se o JSON server está rodando." 
            );

        }finally {
            setCarregando(false);
        }
    }
    async function adicionarTarefa(titulo) {
        try {
            setErro("");

            const novaTarefa = await criarTarefa({
                titulo: titulo,
                concluida : false
            });

            setTarefas((ListaAtual) => [...ListaAtual, novaTarefa]);

        } catch (error){
            console.error(error);
            setErro("Não foi possível cadastrar a tarefa. ")
        }
    }
    async function removerTarefa (id){
        const confirmar = window.confirm(
            "Tem certeza que deseja escluir esta tarefa?"
        );

        if(!confirmar){
            return;
        }
        try{
            setErro("");

            await excluirTarefa(id);

            setTarefas ((ListaAtual) => 
            ListaAtual.filter(
                (tarefa) => tarefa.id !== id
            )
           );
        } catch(error){
            console.error(error);

            setErro("Não foi possível excluir a tarefa. ");

        }
    }
    async function alterarTarefa(tarefa){
        try{
            setErro("");

            const tarefaAtualizada = await atulizarStatus(
                tarefa.id,
                !tarefa.concluida
            );

            setTarefas((ListaAtual) =>
                ListaAtual.map((item) =>
                item.id === tarefa.id ? tarefaAtualizada : item
        )
    );
        }catch (error){
            console.error(error);
            setErro("Não foi possível alterar a tarefa");

        }
    }
    return (
        <>
        <Header />
            <main className="container">
                <section className="apresentação">
                    <h1>Gerenciador de Tarefas</h1>

                    <p>
                        react consumido uma API simulada com JSON Server
                    </p>
                </section>

                <FormTarefa onAdicionar={adicionarTarefa}/>

                {erro && (
                    <p className="erro">
                        {erro}
                    </p>
                )}

                {carregando ? (
                    <p>Carregando...</p>
                ) : (
                    <ListaTarefas
                    tarefa={tarefas}
                    onExcluir= {removerTarefa}
                    onAdicionar= {adicionarTarefa}
                    />
                )}
            </main>

            <Footer />
       
        </>
    )
}

export default App;