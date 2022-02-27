import React from "react";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import axios from "axios";
import parse from "html-react-parser";
import { Col, Row, Container } from "react-bootstrap";

function Feed() {
  const [listOfTours, setListOfTours] = useState([]);

  const getFeed = async () => {
    try {
      const tours = await axios.get("https://kommot-social.herokuapp.com/api/get-feed");
      if (tours) {
        setListOfTours(JSON.parse(tours.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (listOfTours.length === 0) {
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
          <Col></Col>
          <Col>
            <div className="tourDisplay">
              {listOfTours.length > 0 &&
                listOfTours.map((tour) => {
                  return (
                    <div>
                      <Card style={{ width: "30rem" }} className="md-2">
                        <Card.Body>
                          {tour.tour_user_id === tour.tour_creator_id &&
                          tour.tour_type === "tour_recorded" ? (
                            <Card.Title>
                              <a
                                href={
                                  "https://www.komoot.de/user/" +
                                  tour.tour_user_id
                                }
                              >
                                {tour.tour_creator_username}
                              </a>{" "}
                              recorded{" "}
                              <a
                                href={
                                  "https://www.komoot.de/tour/" + tour.tour_id
                                }
                              >
                                {tour.tour_name}
                              </a>
                            </Card.Title>
                          ) : tour.tour_user_id !== tour.tour_creator_id &&
                            tour.tour_type === "tour_recorded" ? (
                            <Card.Title>
                              <a
                                href={
                                  "https://www.komoot.de/user/" +
                                  tour.tour_creator_id
                                }
                              >
                                {tour.tour_creator_username}
                              </a>{" "}
                              recorded{" "}
                              <a
                                href={
                                  "https://www.komoot.de/tour/" + tour.tour_id
                                }
                              >
                                {tour.tour_name}
                              </a>{" "}
                              with{" "}
                              <a
                                href={
                                  "https://www.komoot.de/user/" +
                                  tour.tour_user_id
                                }
                              >
                                {tour.tour_user_username}
                              </a>
                            </Card.Title>
                          ) : (
                            <Card.Title>
                              <a
                                href={
                                  "https://www.komoot.de/user/" +
                                  tour.tour_user_id
                                }
                              >
                                {tour.tour_user_username}
                              </a>{" "}
                              planned{" "}
                              <a
                                href={
                                  "https://www.komoot.de/tour/" + tour.tour_id
                                }
                              >
                                {tour.tour_name}
                              </a>
                            </Card.Title>
                          )}
                          <Card.Subtitle className="mb-2 text-muted">
                            {tour.tour_sport}
                          </Card.Subtitle>
                          <ListGroup variant="flush">
                            <ListGroup.Item>{tour.tour_date}</ListGroup.Item>
                            <ListGroup.Item>
                              {tour.tour_distance} km
                            </ListGroup.Item>
                            <ListGroup.Item>
                              {tour.tour_duration} min
                            </ListGroup.Item>
                            <ListGroup.Item>
                              {tour.tour_elevation_up} m ➚
                            </ListGroup.Item>
                            <ListGroup.Item>
                              {tour.tour_elevation_down} m ➘
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
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}
export default Feed;
