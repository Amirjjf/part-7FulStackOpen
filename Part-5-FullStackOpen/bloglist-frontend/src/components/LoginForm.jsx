import { useState } from "react";
import { Form, Button } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <Form onSubmit={submit}>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          placeholder="Enter your username"
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Enter your password"
        />
      </Form.Group>
      
      <Button type="submit" variant="primary" className="w-100">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
