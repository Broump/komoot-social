import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import { Nav, Container } from "react-bootstrap";

function Footer() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom">
      <Container fluid>
        <Nav>
          <Nav.Link>Impressum</Nav.Link>
          <Navbar.Text>Signed in as: Test</Navbar.Text>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footer;
