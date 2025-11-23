import { useState } from "react";
import { useNavigate } from "react-router";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/users?username=${userName}`
      );
      const data = await response.json();

      if (data.length !== 0) {
        setMessage("Username already taken.");
        return;
      }

      if (verifyPassword === password) {
        setMessage(`Registered successfully, ${userName}!`);
        navigate("/register/additionalInfo", {
          state: { username: userName, password: password },
        });
      } else {
        setMessage("Passwords don't match.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong");
    }

    setPassword("");
    setVerifyPassword("");
  }

  return (
    <>
      <h2>Register</h2>
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
        <label htmlFor="verify-password">Verify Password: </label>
        <input
          id="verify-password"
          type="password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default SignUp;
