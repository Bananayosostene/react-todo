import React, { useState } from "react";
import SignUp from "./signup";
import "../styles/home.css";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

interface Props {
  handlemodal: () => void;
}

const Login: React.FC<Props> = ({ handlemodal }) => {
  const [Signup, setSignup] = useState(false);

  const handleSignUp = () => {
    setSignup(!Signup);
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormData>();

  const onsubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { email, password } = data;

      const response = await axios.post(
        "https://todo-backend-pjp6.onrender.com/todo/user/login",
        {
          useremail: email,
          userpassword: password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("loginStatus", "true");
        window.location.reload();
        console.log("Login successful", response.data);
        handlemodal();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal">
      {Signup && <SignUp handleSignUp={handleSignUp} />}
      <div className="modal-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
          </div>
          <div className="pass">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <p onClick={handleSignUp}>Create account</p>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
