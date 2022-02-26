import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FloatingLabel, Col, Row, Container } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

const Login = () => {
  const [inputField, setInputField] = useState({
    email: "",
    password: "",
  });

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setInputField({
      ...inputField,
      [e.target.name]: value,
    });
  };

  async function LoginUser(e) {
    e.preventDefault();
    await axios
      .post("/api/login", {
        email: inputField.email,
        password: inputField.password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.user) {
          localStorage.setItem("token", response.data.user);
          window.location.href = "/";
        } else {
          alert("wrong email/password");
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
          <Switch>
            <Link to="/register">Register</Link>
          </Switch>
        </Form>
      </Row>
    </Container>
  );
};

export default Login;
