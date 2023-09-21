import React, { useState, useEffect } from 'react';

type Task = {
  id: string;
  text: string;
  done: boolean;
}

function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleTaskAdd = async () => {
    if (newTask.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3001/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newTask, done: false }),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask('');
        setShowModal(false);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleTaskToggle = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
    );

    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTasks.find((task) => task.id === id)),
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
      <div>
        <h1>Todo List</h1>
        <button onClick={() => setShowModal(true)}>Add Task</button>
        {showModal && (
            <div className="modal">
              <div className="modal-content">
            <span onClick={() => setShowModal(false)} className="close">
              &times;
            </span>
                <h2>Add Task</h2>
                <input
                    type="text"
                    placeholder="New Task"
                    value={newTask}
                    onChange={handleTaskChange}
                />
                <button onClick={handleTaskAdd}>Add</button>
              </div>
            </div>
        )}
        <ul>
          {tasks.map((task) => (
              <li key={task.id}>
            <span
                style={{
                  textDecoration: task.done ? 'line-through' : 'none',
                }}
            >
              {task.text}
            </span>
                <button onClick={() => handleTaskToggle(task.id)}>
                  {task.done ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
              </li>
          ))}
        </ul>
      </div>
  );
}

export default TodoApp;
