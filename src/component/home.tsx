import React, { useState, useEffect } from "react";
import "../styles/home.css";
import Login from "./login";

interface Todo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loginStatus") ? true : false
  );
  const [newTodo, setNewTodo] = useState<Todo>({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("loginStatus") ? true : false);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://todo-backend-pjp6.onrender.com/todo/task/gets"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  const handleAddTodo = async () => {
    if (newTodo.title.trim() !== "") {
      if (!localStorage.getItem("token")) {
        alert("Login first to post");
        return;
      } else {
        try {
          const { _id, ...todoData } = newTodo;
          _id

          const response = await fetch(
            "https://todo-backend-pjp6.onrender.com/todo/task/post",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(todoData), 
            }
          );

          if (!response.ok) {
            throw new Error("Failed to create todo");
          }

          await fetchTodos();

          setNewTodo({
            _id: "",
            title: "",
            description: "",
            dueDate: "",
          });
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!localStorage.getItem("token")) {
      alert("Login first");
      return;
    } else {
      try {
        const response = await fetch(
          `https://todo-backend-pjp6.onrender.com/todo/task/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }

        await fetchTodos();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const [modal, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modal);
  };

  const loggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginStatus");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="container">
      {!isLoggedIn && <Login handlemodal={handleModal} />}
      <div className="inner-container">
        <div className="nav">
          <div>
            <h1>Sostene</h1>
            <p>My Todo App in React TSX</p>
          </div>
          {loggedIn ? (
            <button className="login" onClick={handleLogout}>
              logout
            </button>
          ) : (
            <>{/* <button onClick={handleModal}> Login</button> */}</>
          )}
        </div>
        <div className="inputs" id="inputs">
          <input
            className="text"
            type="text"
            name="title"
            placeholder="Enter Title"
            value={newTodo.title}
            onChange={handleChange}
          />
          <input
            className="text"
            name="description"
            placeholder="Enter Description"
            value={newTodo.description}
            onChange={handleChange}
          />
          <input
            className="text"
            name="dueDate"
            placeholder="Enter Due Date"
            value={newTodo.dueDate}
            onChange={handleChange}
          />
        </div>
        <button className="button add" id="add" onClick={handleAddTodo}>
          Add Todo
        </button>
        <button className="button updating" id="update">
          Update Todo
        </button>
        <hr />
        <ul>
          {todos.map((todo) => (
            <li key={todo._id} className="todo-row">
              <div className="values">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <p>{todo.dueDate}</p>
              </div>
              <div className="action">
                <button className="button update">Update</button>
                <button
                  className="button delete"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
