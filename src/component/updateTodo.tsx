import React, { useState } from "react";
import axios from "axios";

interface Props {
  todoId: string;
  title: string;
  description: string;
  dueDate: string;
  onUpdate: () => void;
}

const UpdateTodo: React.FC<Props> = ({
  todoId,
  title,
  description,
  dueDate,
  onUpdate,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedDueDate, setUpdatedDueDate] = useState(dueDate);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token provided");
      }

      const response = await axios.patch(
        `https://todo-backend-pjp6.onrender.com/todo/task/update/${todoId}`,
        {
          title: updatedTitle,
          description: updatedDescription,
          dueDate: updatedDueDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // If the update is successful, trigger the onUpdate callback to refresh the todos
        onUpdate();
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="update-modal">
      <div className="update-content">
        <h2>Update Task</h2>
        <div className="update-text">
        <div>
      <input className="text"
        type="text"
        placeholder="Title"
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
        />
      </div>
        <div>
      <input className="text"
        type="text"
        placeholder="Description"
        value={updatedDescription}
        onChange={(e) => setUpdatedDescription(e.target.value)}
        />
        </div>
        <div>
      <input className="text"
        type="text"
        placeholder="Due Date"
        value={updatedDueDate}
        onChange={(e) => setUpdatedDueDate(e.target.value)}
      />
        </div>
        </div>
        <div className="cancel">
          <button className="button" onClick={handleUpdate}>Update</button>
          <p onClick={onUpdate}>Cancel</p>
        </div>
    </div>
    </div>
  );
};

export default UpdateTodo;
