import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FiTrash, FiEdit } from "react-icons/fi";
import "./App.css";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRend = useRef(true);

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
  });

  //Salvando no localStora e exibindo na tela
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoreact");

    //colocando na tela tarefa caso esteja salva no localStorage
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, []);

  //mapeando lista de tarefa caso tenha alguma mudança
  //e salvando no localStorage quando tem alteraçao nas tarefas
  useEffect(() => {
    if (firstRend.current) {
      firstRend.current = false;
      return;
    }

    //salvando no localStorage quando tem alteraçao nas tarefas
    localStorage.setItem("@cursoreact", JSON.stringify(tasks));
  }, [tasks]);

  //Adiconando tarefa e usando o useCallback para realocar na memoria quando  houver mudança nas dependecias
  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha a tarefa!");
      return;
    }

    if (editTask.enabled) {
      handleSaveEdit();
      return;
    }

    setTasks((tarefas) => [...tarefas, input]);

    //limpando campo tarefa
    setInput("");
  }, [input, tasks]);

  //deletando tarefa
  function handleDelete(item: string) {
    const removeTask = tasks.filter((tasks) => tasks !== item);
    setTasks(removeTask);
  }

  //previnindo o enviar de nova tarefa enquanto edita
  function handleSaveEdit() {
    const findTaskIndex = tasks.findIndex((tasks) => tasks === editTask.task);

    //clonando array de tarefas
    const allTasks = [...tasks];

    //substituindo array de tarefa
    allTasks[findTaskIndex] = input;
    setTasks(allTasks);

    //afirmando que terminou de editar
    setEditTask({
      enabled: false,
      task: "",
    });

    //limpando campo tarefa
    setInput("");
  }

  // editando tarefa
  function handleEdit(item: string) {
    // colocando foco na barra de adicionar tarefa
    inputRef.current?.focus();

    setInput(item);
    setEditTask({
      enabled: true,
      task: item,
    });
  }

  // contando quantas tarefas tem, e evitando perda de performace
  const totalTarefas = useMemo(() => {
    return tasks.length;
  }, [tasks]);

  return (
    <div>
      <main className="container">
        <h1>Lista de Tarefas</h1>
        <div className="pesquisa">
          <input
            placeholder="Digite a tarefa"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
          />

          <button onClick={handleRegister}>
            {editTask.enabled ? "Editar Tarefa" : "Adicionar Tarefa"}
          </button>
        </div>

        <h2>
          {totalTarefas > 1
            ? `Você tem ${totalTarefas} tarefas....`
            : totalTarefas < 1
            ? `Você não tem tarefa..`
            : `Você tem ${totalTarefas} tarefa....`}
        </h2>

        {tasks.map((item) => (
          <section key={item}>
            <ul>
              <li> {item}</li>
              <div className="button">
                <button
                  className="icons"
                  onClick={() => {
                    handleEdit(item);
                  }}
                >
                  <FiEdit size={18} />
                </button>

                <button className="icons" onClick={() => handleDelete(item)}>
                  <FiTrash size={18} />
                </button>
              </div>
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
