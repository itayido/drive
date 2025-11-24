import { useState } from "react";
import { useNavigate, Link } from "react-router";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });

      if (response.ok) {
        setMessage("Login successful!");
        const data = await response.json();
        localStorage.setItem("ActiveUser", JSON.stringify(data));
        navigate(`/home/${data.username}`);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong");
    }

    setUserName("");
    setPassword("");
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userName">Username: </label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
        <br />
        <Link to="../SignUp">Haven't got an account yet? sign up here</Link>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default Login;
