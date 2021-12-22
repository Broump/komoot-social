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
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

const handleLogout = () => {
  localStorage.removeItem("token");
};

function Navigation() {
  return (
    <Navbar collapseOnSelect expand="false" bg="dark" variant="dark">
      <Container fluid>
        <NavbarBrand>
          <Link as={Link} to="/">
            Komoot-Social
          </Link>
        </NavbarBrand>
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
            <Switch>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/statistics">
                  Statistics
                </Nav.Link>
                <Nav.Link as={Link} to="/tours">
                  Tours
                </Nav.Link>
                <Nav.Link as={Link} to="/friends">
                  Friends
                </Nav.Link>
              </Nav>
            </Switch>
            <Button className="mt-4" onClick={() => handleLogout()}>
              LogOut
            </Button>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default Navigation;
