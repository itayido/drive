import { useState } from "react";
import { useNavigate } from "react-router";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== verifyPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/SignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password,
          email: email,
          name: name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Registered successfully, ${data.username}!`);
        localStorage.setItem("ActiveUser", JSON.stringify(data));
        navigate(`/home/${data.username}`);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Something went wrong: ", error);
    }

    setPassword("");
    setVerifyPassword("");
    setUserName("");
    setEmail("");
    setName("");
  }

  return (
    <>
      <h2>Sign Up</h2>
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
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="name">Full Name: </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default SignUp;
