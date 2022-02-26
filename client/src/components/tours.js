import React from "react";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { DefaultEditor } from "react-simple-wysiwyg";
import parse from "html-react-parser";
import { Col, Row, Container } from "react-bootstrap";

function Tours({ isAuth: isAuth, component: Component, ...rest }) {
  const [listOfTours, setListOfTours] = useState([]);
  const [changedTourValues, setChangedTourValues] = useState({
    is_private: "null",
    tour_text: "null",
  });

  console.log(changedTourValues)

  const [editingTour, setEditingTour] = useState({
    editing: false,
    tour_id: null,
  });

  const [html, setHtml] = useState(null);

  const handleEditing = (tour_id) => {
    setEditingTour({ editing: true, tour_id: tour_id });
  };

  const handleTextInput = (e) => {
    setHtml(e.target.value);
    setChangedTourValues({
      is_private: changedTourValues.is_private,
      tour_text: e.target.value,
    });
  };

  const handleSwitchInput = (e) => {
    let value = e.target.checked;
    if (value) {
      setChangedTourValues({
        is_private: 1,
        tour_text: changedTourValues.tour_text,
      });
    } else {
      setChangedTourValues({
        is_private: 0,
        tour_text: changedTourValues.tour_text,
      });
    }
  };

  const getAllTours = async () => {
    try {
      const tours = await axios.get("/api/all-tours", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (tours) {
        setListOfTours(JSON.parse(tours.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const UpdateTour = (tour_id) => {
    axios.get("/api/update-tour", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
        is_private: changedTourValues.is_private,
        tour_text: changedTourValues.tour_text,
        tour_id: tour_id,
      },
    });
  };

  useEffect(() => {
    getAllTours();
  }, []);

  if (listOfTours.length === 0) {
    return (
      <Container>
        <Row>
          <Col>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
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
                              {tour.is_private === 1 ? (
                                <p>Status: Privat</p>
                              ) : (
                                <p>Status: Öffentlich</p>
                              )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Card.Text>Beschreibung:</Card.Text>
                              <Card.Text>
                                {parse(`${tour.tour_text}`)}
                              </Card.Text>
                            </ListGroup.Item>
                            <ListGroup.Item className="mt-3">
                              <Button
                                onClick={() => {
                                  handleEditing(tour.tour_id);
                                }}
                              >
                                Edit
                              </Button>
                            </ListGroup.Item>
                            {editingTour.editing &&
                            editingTour.tour_id === tour.tour_id ? (
                              <Container className="mt-3">
                                <Form.Check
                                  type="switch"
                                  className="mb-3"
                                  id="custom-switch"
                                  label="Change Status"
                                  defaultChecked={tour.is_private}
                                  onChange={(e) => {
                                    handleSwitchInput(e);
                                  }}
                                />

                                <DefaultEditor
                                  value={html}
                                  onChange={(e) => {
                                    handleTextInput(e);
                                  }}
                                />

                                <Button
                                  className="mt-3"
                                  onClick={() => {
                                    UpdateTour(tour.tour_id);
                                    setEditingTour({ editing: false });
                                  }}
                                >
                                  Update
                                </Button>
                              </Container>
                            ) : (
                              <p></p>
                            )}
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
export default withRouter(Tours);
