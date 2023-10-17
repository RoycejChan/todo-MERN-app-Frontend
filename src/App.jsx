import React, { useEffect, useState } from 'react';

export default function App() {
  const base_URL = "https://mern-todotask-app-api.onrender.com";
  const [newToDo, setNewToDo] = useState("");
  const [todos, setToDos] = useState([]);
  const [editingTask, setEditingTask] = useState({ id: null, text: "" });
  const [selectedPriority, setSelectedPriority] = useState("High");


  useEffect(() => {
    const fetchToDos = async () => {
      try {
        const response = await fetch(`${base_URL}`);
        const data = await response.json();
        setToDos(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchToDos();
  }, []);

  
  const addNewTask = () => {
    
    if (newToDo.trim() === '') {
      alert("Please enter a task");
      return;
    }
    
    const newTask = {
      text: newToDo,
      priority: selectedPriority,
    };
  
    fetch(`${base_URL}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("New to-do item created:", data);
        setToDos([...todos, data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const editTask = (id, text) => {
    setEditingTask({ id, text });
  };

  const saveEditedTask = () => {
    const { id, text } = editingTask;
    const taskToEdit = todos.find((todo) => todo._id === id);
    const completed = taskToEdit ? taskToEdit.completed : false; 
  
    fetch(`${base_URL}/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, completed: !completed }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Edited task:", data);
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? { ...todo, text, completed: !completed } : todo
        );
        setToDos(updatedTodos);
        setEditingTask({ id: null, text: "" });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const cancelEdit = () => {
    setEditingTask({ id: null, text: "" });

  }

  const deleteTask = (id) => {
    
    fetch(`${base_URL}/delete/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        console.log('Deleted taskk');
        setToDos(todos.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }


const completeToDo = (id) => {
  const updatedTodos = todos.map((todo) => {
    if (todo._id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  setToDos(updatedTodos);

};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
      return "high-priority";
    case "Medium":
      return "medium-priority";
    case "Low":
      return "low-priority";
    default:
      return "";
  }
};

  return (
    <>
      <div className="todo-container">
          <h1 className='todo-header ' data-aos="flip-up" data-aos-duration="800">To-Do-List</h1>

          <div className="addTaskContainer">
            <input
              type="text"
              placeholder="Enter a new Task..."
              value={newToDo}
              onChange={(e) => setNewToDo(e.target.value)}
              className='newTodoInput'
            />
            <div className="userBtnsContainer">
         <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="priority-select newToDoButton"
          >
            <option value="High" className='high-option'>High</option>
            <option value="Medium" className='medium-option'>Medium</option>
            <option value="Low" className='low-option'>Low</option>
          </select>
        
            <button onClick={addNewTask} className='newTodoButton'>➕</button>
            </div>
          </div> 

          <ul className='todos-list' data-aos="slide-up"   data-aos-duration="700">
  {todos.slice().reverse().map((todo) => (
    <li key={todo._id} className='todo-listitem'>
      {editingTask.id === todo._id ? (
        <div className='todo-item'>
          <input
            className='editTodoInput'
            type="text"
            placeholder='Editing Task'
            value={editingTask.text}
            onChange={(e) =>
              setEditingTask({ id: todo._id, text: e.target.value })
            }
          />
          <button onClick={saveEditedTask} className='todo-buttons'>Save</button>
          <button onClick={cancelEdit} className='todo-buttons'>Cancel</button>
        </div>
      ) : (
      <div className={`todo-item 
            ${todo.completed ? "completed" : ""}
          ${getPriorityClass(todo.priority)}`} 
          id="todolistitem" 
          // data-aos="slide-right"
       >
        <p className="todo-item-text" onClick={() => completeToDo(todo._id)}>
           {todo.text}
        </p>
        <div className="btns-container">             
          <button onClick={() => editTask(todo._id, todo.text)} className='todo-buttons'>✏️</button>
          <button onClick={() => deleteTask(todo._id)} className='todo-buttons'>🗑️</button>
        </div>
      </div>
      )}
    </li>
  ))}
</ul>
      </div>
    </>
  );
}
