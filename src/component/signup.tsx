import React, { useState } from "react";
import "../styles/home.css"

interface SignUpProps {
  handleSignUp: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ handleSignUp }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const createAccount = async () => {
    try {
      const response = await fetch(
        "https://todo-backend-pjp6.onrender.com/todo/user/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      console.log("User created successfully");

      handleSignUp();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={handleSignUp}>
          X
        </button>
        <h2>Sign Up</h2>
        <div>
          <input
            className="text "
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            className="text "
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="pass">
          <input
            className="text "
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button onClick={createAccount}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignUp;
