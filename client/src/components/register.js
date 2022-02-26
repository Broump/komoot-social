import "../App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FloatingLabel, Col, Row, Container } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";

function Register() {
  const [inputField, setInputField] = useState({
    username: "",
    email: "",
    password: "",
    komootEmail: "",
    komootPassword: "",
    kommotID: "",
  });

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setInputField({
      ...inputField,
      [e.target.name]: value,
    });
  };

  async function RegisterUser(e) {
    e.preventDefault();
    await axios.post("/api/register", {
      username: inputField.username,
      email: inputField.email,
      password: inputField.password,
      komootEmail: inputField.komootEmail,
      komootPassword: inputField.komootPassword,
      komootID: inputField.komootID,
    });
    window.location.href = "/login";
  }

  return (
    <Container className="w-25 p-10">
      <Row>
        <Col>
          <Form>
            <FloatingLabel
              controlId="floatingInput"
              label="Username"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={inputField.username}
                onChange={(e) => handleChangeInput(e)}
              />
            </FloatingLabel>

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
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form>
            <FloatingLabel
              controlId="floatingInput"
              label="Komoot-Email"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="komootEmail"
                value={inputField.komootEmail}
                onChange={(e) => handleChangeInput(e)}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingPassword"
              label="Komoot-Password"
              className="mb-3"
            >
              <Form.Control
                type="password"
                placeholder="Password"
                name="komootPassword"
                value={inputField.komootPassword}
                onChange={(e) => handleChangeInput(e)}
              />
            </FloatingLabel>

            <FloatingLabel
              className="mb-3"
              controlId="floatingInput"
              label="Komoot-ID"
            >
              <Form.Control
                type="text"
                placeholder="Komoot-ID"
                name="komootID"
                value={inputField.komootID}
                onChange={(e) => handleChangeInput(e)}
              />
            </FloatingLabel>
            <Button variant="primary" type="submit" onClick={RegisterUser}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
