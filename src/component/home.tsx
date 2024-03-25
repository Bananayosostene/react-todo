import React, { useState, useEffect } from "react";
import "../styles/home.css";
import Login from "./login";
import UpdateTodo from "./updateTodo";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

interface Todo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("loginStatus")
  );
  const [newTodo, setNewTodo] = useState<Todo>({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("loginStatus"));
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

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleUpdateSuccess = () => {
    setSelectedTodo(null);
    fetchTodos();
  };

  const handleModal = () => {
    setModal(!modal);
  };

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
            <h1 className="logo">Sostene</h1>
            <p>My Todo App in React TSX</p>
          </div>
          {isLoggedIn && (
            <button className="button" onClick={handleLogout}>
              logout
            </button>
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
                <FaEdit
                  className="update"
                  onClick={() => handleUpdateClick(todo)}
                />
                <RiDeleteBin2Line
                  className="delete"
                  onClick={() => handleDeleteTodo(todo._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedTodo && (
        <UpdateTodo
          todoId={selectedTodo._id}
          title={selectedTodo.title}
          description={selectedTodo.description}
          dueDate={selectedTodo.dueDate}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Home;
