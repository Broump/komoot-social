import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import { Nav, Container } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

function Footer() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("/api/user-data", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsername(response.data.username);
      });
  });
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom">
      <Container fluid>
        <Nav>
          <Nav.Link>Impressum</Nav.Link>
          <Navbar.Text>Signed in as: {username}</Navbar.Text>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footer;
