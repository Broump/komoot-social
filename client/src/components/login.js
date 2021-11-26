import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FloatingLabel, Col, Row, Container } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [inputField, setInputField] = useState({
    email: "",
    password: "",
  });

  const [loginStatus, setLoginStatus] = useState("");

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setInputField({
      ...inputField,
      [e.target.name]: value,
    });
  };

  async function LoginUser() {
    axios
      .post("/api/login", {
        email: inputField.email,
        password: inputField.password,
      })
      .then((response) => {
        console.log(response);
        console.log("user is logged in");
        if (!response.data.auth) {
          setLoginStatus(false);
        } else {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          setLoginStatus(true);
        }
      });
  }
  return (
    <Container>
      <Row>
        <Col />

        <Form className="">
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              value={inputField.email}
              onChange={(e) => handleChangeInput(e)}
            />
          </FloatingLabel>
          <FloatingLabel
            className="mb-3"
            controlId="floatingPassword"
            label="Password"
          >
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={inputField.password}
              onChange={(e) => handleChangeInput(e)}
            />
          </FloatingLabel>
          <Button variant="primary" type="submit" onClick={LoginUser}>
            Submit
          </Button>
          <Col />
        </Form>
      </Row>
    </Container>
  );
}

export default Login;
