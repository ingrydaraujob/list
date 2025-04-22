import { useState } from 'react';
import './App.css';

function App() {
  // armazenamento da lista de tarefas
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: "Reunião com o time de desenvolvimento",
      category: "Trabalho",
      isCompleted: false,
      priority: "alta"
    },
    {
      id: 2,
      text: "Atualizar relatório mensal",
      category: "Trabalho",
      isCompleted: false,
      priority: "media"
    },
    {
      id: 3,
      text: "Ler artigo sobre novas tecnologias",
      category: "Desenvolvimento",
      isCompleted: false,
      priority: "baixa"
    }
  ]);

  //controle do formulário
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('Trabalho');
  const [newTodoPriority, setNewTodoPriority] = useState('media');
  const [filter, setFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Adiciona uma nova tarefa à lista
   * Verifica se o texto não está vazio antes de adicionar
   */
  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    const newTodo = {
      id: Math.floor(Math.random() * 10000),
      text: newTodoText,
      category: newTodoCategory,
      priority: newTodoPriority,
      isCompleted: false,
    };

    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  /**
   * Remove tarefa da lista
   * @param {number} id - ID da tarefa a ser removida
   */
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  /**
   * Alterna o status de completado de uma tarefa
   * @param {number} id - ID da tarefa a ser marcada/completada
   */
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  /**
   * Filtra as tarefas com base nos critérios selecionados
   * Combina filtro de categoria com busca por texto
   */
  const filteredTodos = todos.filter(todo => {
    
    const categoryMatch = 
      filter === 'Todas' || 
      (filter === 'Completas' && todo.isCompleted) ||
      (filter === 'Pendentes' && !todo.isCompleted) ||
      todo.category === filter;
    
    // Filtro por busca de texto
    const searchMatch = 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  /**
   * Ordena as tarefas por prioridade (alta > média > baixa)
   * Tarefas completas vão para o final da lista
   */
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    
    const priorityOrder = { alta: 1, media: 2, baixa: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="app">
      <header>
        <h1>Lista de tarefas</h1>
        <p>Gerencie suas tarefas diárias</p>
      </header>
      
      {/* adicionar novas tarefas */}
      <div className="add-todo">
        <input
          type="text"
          placeholder="Adicione uma nova tarefa..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        
        <div className="select-group">
          <select
            value={newTodoCategory}
            onChange={(e) => setNewTodoCategory(e.target.value)}
          >
            <option value="Trabalho">Trabalho</option>
            <option value="Desenvolvimento">Desenvolvimento</option>
            <option value="Reuniões">Reuniões</option>
            <option value="Administrativo">Administrativo</option>
          </select>
          
          <select
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value)}
          >
            <option value="alta">Alta Prioridade</option>
            <option value="media">Média Prioridade</option>
            <option value="baixa">Baixa Prioridade</option>
          </select>
        </div>
        
        <button onClick={addTodo}>Adicionar Tarefa</button>
      </div>

      {/* Barra de filtros e busca */}
      <div className="controls">
        <div className="search">
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <span>Filtrar:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Todas">Todas</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Desenvolvimento">Desenvolvimento</option>
            <option value="Reuniões">Reuniões</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Completas">Completas</option>
            <option value="Pendentes">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Lista de tarefas */}
      <div className="todo-list">
        {sortedTodos.length > 0 ? (
          sortedTodos.map((todo) => (
            <div 
              className={`todo ${todo.isCompleted ? 'completed' : ''} priority-${todo.priority}`}
              key={todo.id}
            >
              <div 
                className="content"
                onClick={() => toggleComplete(todo.id)}
              >
                <p className={todo.isCompleted ? 'completed-text' : ''}>
                  {todo.text}
                </p>
                <div className="meta">
                  <span className={`category ${todo.category.toLowerCase()}`}>
                    {todo.category}
                  </span>
                  <span className={`priority-dot ${todo.priority}`}></span>
                </div>
              </div>
              <button 
                className="delete-button"
                onClick={() => removeTodo(todo.id)}
                aria-label="Remover tarefa"
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Nenhuma tarefa encontrada</p>
          </div>
        )}
      </div>
      
      {/* Resumo estatístico */}
      <div className="stats">
        <p>
          Total: <span>{todos.length}</span> | 
          Pendentes: <span>{todos.filter(t => !t.isCompleted).length}</span> | 
          Concluídas: <span>{todos.filter(t => t.isCompleted).length}</span>
        </p>
      </div>
    </div>
  );
}

export default App;