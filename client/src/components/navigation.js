import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import {
  Container,
  FormControl,
  NavbarBrand,
  Form,
  Nav,
  Offcanvas,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";

function Navigation() {
  return (
    <Navbar collapseOnSelect expand="false" bg="dark" variant="dark">
      <Container fluid>
        <NavbarBrand>Komoot-Social</NavbarBrand>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search for tour"
            classname=""
            aria-lable="Search"
          ></FormControl>
          <Button variant="outline-success" className="">
            Search
          </Button>
        </Form>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="#action1">Profile</Nav.Link>
              <Nav.Link href="#action1">Statistics</Nav.Link>
              <Nav.Link href="#action1">Friends</Nav.Link>
              <Nav.Link href="#action2">Notion</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Navigation;
