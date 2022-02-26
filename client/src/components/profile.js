import React from "react";
import { withRouter } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Container,
} from "react-bootstrap";

function Profile({ isAuth: isAuth, component: Component, ...rest }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [komootID, setKomootID] = useState("");

  useEffect(() => {
    axios
      .get("https://kommot-social.herokuapp.com/api/user-data", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setKomootID(response.data.komootID);
      });
  });

  if (username === "") {
    return (
      <div>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    return (
      <Container>
        <Row>
          <Col />
          <Card style={{ width: "25rem" }}>
            <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
            <Card.Body>
              <Card.Title>{username}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Email: {email}</ListGroupItem>
              <ListGroupItem>...</ListGroupItem>
              <ListGroupItem>...</ListGroupItem>
            </ListGroup>
            <Card.Body>
              <Card.Link>
                <a href={"https://komoot.de/user/" + komootID}>KomootProfil</a>
              </Card.Link>
            </Card.Body>
          </Card>
          <Col />
        </Row>
      </Container>
    );
  }
}

export default withRouter(Profile);
