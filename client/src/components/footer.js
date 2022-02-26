import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import { Nav, Container } from "react-bootstrap";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

function Footer() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("https://kommot-social.herokuapp.com/api/user-data", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsername(response.data.username);
      });
  });
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom" display="block">
      <Container fluid>
        <Switch>
          <Nav>
            <Nav.Link>Impressum</Nav.Link>
            {username ? (
              <Navbar.Text>Signed in as: {username}</Navbar.Text>
            ) : (
              <Navbar.Text>
                <Link to="/login">login</Link>/
                <Link to="/register">register</Link>
              </Navbar.Text>
            )}
          </Nav>
        </Switch>
      </Container>
    </Navbar>
  );
}

export default Footer;
