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
    formState:{errors}
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
        <div className="in">
          <h2>Login</h2>
          <p onClick={handleSignUp}>Create account</p>
        </div>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div>
            <input
              className="text "
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "12px" }}>invalid email</p>
            )}
          </div>
          <div>
            <input
              className="text "
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "12px" }}>
                enter correct password
              </p>
            )}
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
