import "../App.css";
import React, { Component, useState }  from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import {
  Container,
  FormControl,
  NavbarBrand,
  Form,
  Nav,
  Offcanvas,
  Card,
  ListGroup,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import parse from "html-react-parser";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";



function Navigation() {

  const [search, setSearch] = useState([])
  const [listOfTours, setListOfTours] = useState([])

  console.log(listOfTours)



  const handleLogout = () => {
    localStorage.removeItem("token");
  };
  
  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  const hanldeSearch = async () => {
    try {
      const tours = await axios.get("https://kommot-social.herokuapp.com/api/search",{
        headers: {
          search: search
        },
      });
      if (tours) {
        setListOfTours(JSON.parse(tours.data));
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div>
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
            onChange={(e) => {
              handleSearchInput(e);
            }}
          ></FormControl>
          <Button variant="outline-success" className="" onClick={() => {
                hanldeSearch();
              }}>
            Search
          </Button>
        </Form>
        <div className="tourDisplay">
              {listOfTours.length > 0 &&
                listOfTours.map((tour) => {
                  return (
                    <div>
                      <Card style={{ width: "35rem" }} className="md-2">
                        <Card.Body>
                          <Card.Title>
                            <a
                              href={
                                "https://www.komoot.de/tour/" + tour.tour_id
                              }
                            >
                              {tour.tour_name}
                            </a>
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {tour.tour_sport}
                          </Card.Subtitle>
                          <ListGroup variant="flush">
                            <ListGroup.Item>
                              Date: {tour.tour_date}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Start: {tour.tour_start_point}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Distance: {tour.tour_distance} km
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Duration: {tour.tour_duration} min
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Elevation Up: {tour.tour_elevation_up} m ➚
                            </ListGroup.Item>
                            <ListGroup.Item>
                              Elevation Down: {tour.tour_elevation_down} m ➘
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Card.Text>Beschreibung:</Card.Text>
                              <Card.Text>
                                {parse(`${tour.tour_text}`)}
                              </Card.Text>
                            </ListGroup.Item>
                          </ListGroup>
                        </Card.Body>
                      </Card>
                      <br></br>
                    </div>
                  );
                })}
            </div>
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
    </div>
  );
}

export default Navigation;
