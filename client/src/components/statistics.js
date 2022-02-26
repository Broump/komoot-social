import React from "react";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Chart, { Chart as ChartJS, defaults } from "react-chartjs-2";
import Form from "react-bootstrap/Form";
import { Bar, Line } from "react-chartjs-2";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Container,
  FormControl,
  Button,
} from "react-bootstrap";

function Statistics({ isAuth: isAuth, component: Component, ...rest }) {
  const [sportCount, setSportCount] = useState([]);
  const [sportCountFriend, setSportCountFriend] = useState([]);
  const [totalSport, setTotalSport] = useState([]);
  const [totalSportFriend, setTotalSportFriend] = useState([]);
  const [selectedStatistic, setSelectedStatisitic] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [listOfFriends, setListOfFriends] = useState([]);
  const [compareStatus, setCompareStatus] = useState(false);
  const [toursInMonthPerYear, setToursInMonthPerYear] = useState([]);
  const [toursInMonthPerYearFriend, setToursInMonthPerYearFriend] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  console.log(selectedFriend)

  

  const getListOfFriends = async () => {
    try {
      const friends = await axios.get("/api/list-friends", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (friends) {
        setListOfFriends(friends.data.listOfFriends);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getHowOftenSports = async () => {
    try {
      const count = await axios.get("/api/howOftenSport", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (count) {
        setSportCount(count.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getHowOftenSportsFriend = async () => {
    try {
      
      const totalFriend = await axios.get("/api/HowOftenSportsFriend", {
        headers: {
          friendemail: selectedFriend,
        },
      });
      if (totalFriend) {
        setSportCountFriend(totalFriend.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalSportValues = async () => {
    try {
      const total = await axios.get("/api/totalSportValues", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (total) {
        setTotalSport(total.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalSportValuesFriend = async () => {
    try {
      
      const totalFriend = await axios.get("/api/totalSportValuesFriend", {
        headers: {
          friendemail: selectedFriend,
        },
      });
      if (totalFriend) {
        setTotalSportFriend(totalFriend.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const gettoursInMonthPerYear = async (year) => {
    try {
      const count = await axios.get("/api/toursInMonthPerYear", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
          year: year,
        },
      });
      if (count) {
        setToursInMonthPerYear(count.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const gettoursInMonthPerYearFriend = async () => {
    try {
      
      const totalFriend = await axios.get("/api/toursInMonthPerYearFriend", {
        headers: {
          friendemail: selectedFriend,
          year: selectedYear,
        },
      });
      if (totalFriend) {
        setToursInMonthPerYearFriend(totalFriend.data);
        
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  const hanldeCompare = () => {
    if (compareStatus === false) {
      setCompareStatus(true);
    } else if (compareStatus === true) {
      setCompareStatus(false);
    }
  };
  

  const handleYear = () => {
    gettoursInMonthPerYear(selectedYear);
  };

  useEffect(() => {
    getHowOftenSports();
    getTotalSportValues();
    getListOfFriends();
    
  }, []);

  const handleStatisticInput = (e) => {
    const value = e.target.value;
    if (value !== "none") {
      setSelectedStatisitic(value);
    }
  };

  const handleFriendInput = (e) => {
    const value = e.target.value;
    if (value !== "none") {
      setSelectedFriend(value);
    }
  };

  const handleYearInput = (e) => {
    const value = e.target.value;
    if (value !== "none") {
      setSelectedYear(value);
    }
  };

  

  if (selectedStatistic === "howoften" && compareStatus === false) {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
            <Button
              className="mt-4"
              variant="outline-success"
              onClick={() => {
                hanldeCompare();
              }}
            >
              Compare with Friend
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {sportCount.map((sport) => {
              return (
                <div>
                  <Bar
                    className="mt-3"
                    data={{
                      labels: [
                        "e_mtb",
                        "e_mtb_advanced",
                        "e_mtb_easy",
                        "e_racebike",
                        "e_touringbicycle",
                        "hike",
                        "jogging",
                        "mountaineering",
                        "mtb",
                        "mtb_advanced",
                        "mtb_easy",
                        "racebike",
                        "touringbicycle",
                      ],
                      datasets: [
                        {
                          label: "# number of sporttypes",
                          data: [
                            sport.e_mtb,
                            sport.e_mtb_advanced,
                            sport.e_mtb_easy,
                            sport.e_racebike,
                            sport.e_touringbicycle,
                            sport.hike,
                            sport.jogging,
                            sport.mountaineering,
                            sport.mtb,
                            sport.mtb_advanced,
                            sport.mtb_easy,
                            sport.mtb_easy,
                            sport.racebike,
                            sport.touringbicycle,
                          ],
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderWidth: 2,
                          skipNull: false,
                        },
                      ],
                    }}
                    height={400}
                    width={400}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        yAxes: {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      },
                    }}
                  />
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
    );
  } else if (selectedStatistic === "total" && compareStatus === false) {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                hanldeCompare();
              }}
            >
              Compare with Friend
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {totalSport.map((total) => {
              return (
                <div>
                  <Card style={{ width: "25rem" }} className="mt-3">
                    <Card.Body>
                      <Card.Title>Total Sport Values</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroupItem>
                        Total recorded Tours: {total.totalrecordedtours}
                      </ListGroupItem>
                      <ListGroupItem>
                        Total planned Tours: {total.totalplannedtours}
                      </ListGroupItem>
                      <ListGroupItem>
                        Total distance: {total.totaldistance}
                      </ListGroupItem>
                      <ListGroupItem>
                        Total duration: {total.totalduration}
                      </ListGroupItem>
                      <ListGroupItem>
                        Total elevation up: {total.totalelevationup}
                      </ListGroupItem>
                      <ListGroupItem>
                        Total elevation down: {total.totalelevationdown}
                      </ListGroupItem>
                    </ListGroup>
                  </Card>
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
    );
  } else if (selectedStatistic === "howoften" && compareStatus === true) {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
            <Form.Control
              className="mt-2"
              as="select"
              custom
              onChange={(e) => handleFriendInput(e)}
            >
              <option value="none">--Select Friend To Compare--</option>
              {listOfFriends.map((friend) => (
                <option value={friend.email}>{friend.username}</option>
              ))}
            </Form.Control>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                getHowOftenSportsFriend();
              }}
            >
              Load Friend Data
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {sportCount.map((sport) => {
              return sportCountFriend.map((sportFriend) => {
                return (
                  <div>
                    <Bar
                      className="mt-3"
                      data={{
                        labels: [
                          "e_mtb",
                          "e_mtb_advanced",
                          "e_mtb_easy",
                          "e_racebike",
                          "e_touringbicycle",
                          "hike",
                          "jogging",
                          "mountaineering",
                          "mtb",
                          "mtb_advanced",
                          "mtb_easy",
                          "racebike",
                          "touringbicycle",
                        ],
                        datasets: [
                          {
                            label: "# number of sporttypes from you",
                            data: [
                              sport.e_mtb,
                              sport.e_mtb_advanced,
                              sport.e_mtb_easy,
                              sport.e_racebike,
                              sport.e_touringbicycle,
                              sport.hike,
                              sport.jogging,
                              sport.mountaineering,
                              sport.mtb,
                              sport.mtb_advanced,
                              sport.mtb_easy,
                              sport.mtb_easy,
                              sport.racebike,
                              sport.touringbicycle,
                            ],
                            backgroundColor: [
                              "rgba(185, 163, 1, 0.4)",
                              "rgba(54, 162, 235, 1)",
                              "rgba(255, 206, 86, 1)",
                              "rgba(75, 192, 192, 1)",
                              "rgba(153, 102, 255, 1)",
                              "rgba(255, 159, 64, 1)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(2, 7, 156, 0.2)",
                              "rgba(62, 171, 0, 0.5)",
                              "rgba(22, 254, 177, 0.1)",
                              "rgba(199, 51, 156, 1) ",
                              "rgba(5, 160, 96, 0.3)",
                            ],
                            borderColor: [
                              "rgba(185, 163, 1, 0.4)",
                              "rgba(54, 162, 235, 1)",
                              "rgba(255, 206, 86, 1)",
                              "rgba(75, 192, 192, 1)",
                              "rgba(153, 102, 255, 1)",
                              "rgba(255, 159, 64, 1)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(2, 7, 156, 0.2) rgba(2, 7, 156, 0.2)",
                              "rgba(62, 171, 0, 0.5)",
                              "rgba(22, 254, 177, 0.1)",
                              "rgba(199, 51, 156, 1) ",
                              "rgba(5, 160, 96, 0.3)",
                            ],
                            borderWidth: 2,
                            skipNull: false,
                          },
                          {
                            label:
                              "# number of sporttypes from " + selectedFriend,
                            data: [
                              sportFriend.e_mtb,
                              sportFriend.e_mtb_advanced,
                              sportFriend.e_mtb_easy,
                              sportFriend.e_racebike,
                              sportFriend.e_touringbicycle,
                              sportFriend.hike,
                              sportFriend.jogging,
                              sportFriend.mountaineering,
                              sportFriend.mtb,
                              sportFriend.mtb_advanced,
                              sportFriend.mtb_easy,
                              sportFriend.mtb_easy,
                              sportFriend.racebike,
                              sportFriend.touringbicycle,
                            ],
                            backgroundColor: [
                              "rgba(255, 99, 132, 0.2)",
                              "rgba(54, 162, 235, 0.2)",
                              "rgba(255, 206, 86, 0.2)",
                              "rgba(75, 192, 192, 0.2)",
                              "rgba(153, 102, 255, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                            ],
                            borderColor: [
                              "rgba(255, 99, 132, 1)",
                              "rgba(54, 162, 235, 1)",
                              "rgba(255, 206, 86, 1)",
                              "rgba(75, 192, 192, 1)",
                              "rgba(153, 102, 255, 1)",
                              "rgba(255, 159, 64, 1)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                              "rgba(255, 159, 64, 0.2)",
                            ],
                            borderWidth: 2,
                            skipNull: false,
                          },
                        ],
                      }}
                      height={400}
                      width={400}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          yAxes: {
                            ticks: {
                              beginAtZero: true,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                );
              });
            })}
          </Col>
        </Row>
      </Container>
    );
  } else if (selectedStatistic === "total" && compareStatus === true) {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
            <Form.Control
              className="mt-2"
              as="select"
              custom
              onChange={(e) => handleFriendInput(e)}
            >
              <option value="none">--Select Friend To Compare--</option>
              {listOfFriends.map((friend) => (
                <option value={friend.email}>{friend.username}</option>
              ))}
            </Form.Control>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                getTotalSportValuesFriend();
              }}
            >
              Load Friend Data
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {totalSport.map((total) => {
              return totalSportFriend.map((totalFriend) => {
                return (
                  <div>
                    <Card style={{ width: "32rem" }} className="mt-3">
                      <Card.Body>
                        <Card.Title>Total Sport Values</Card.Title>
                      </Card.Body>
                      <ListGroup className="list-group-flush">
                        <ListGroupItem>
                          Total recorded Tours: {total.totalrecordedtours} /{" "}
                          {totalFriend.totalrecordedtours}
                        </ListGroupItem>
                        <ListGroupItem>
                          Total planned Tours: {total.totalplannedtours} /{" "}
                          {totalFriend.totalplannedtours}
                        </ListGroupItem>
                        <ListGroupItem>
                          Total distance: {total.totaldistance} /{" "}
                          {totalFriend.totaldistance}
                        </ListGroupItem>
                        <ListGroupItem>
                          Total duration: {total.totalduration} /{" "}
                          {totalFriend.totalduration}
                        </ListGroupItem>
                        <ListGroupItem>
                          Total elevation up: {total.totalelevationup} /{" "}
                          {totalFriend.totalelevationup}
                        </ListGroupItem>
                        <ListGroupItem>
                          Total elevation down: {total.totalelevationdown} /{" "}
                          {totalFriend.totalelevationdown}
                        </ListGroupItem>
                      </ListGroup>
                    </Card>
                  </div>
                );
              });
            })}
          </Col>
        </Row>
      </Container>
    );
  } else if (selectedStatistic === "sportPerMonth" && compareStatus === false) {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleYearInput(e)}
            > 
              <option value="none">--Select Year--</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </Form.Control>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                handleYear();
              }}
            >
              Select Year
            </Button>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                hanldeCompare();
              }}
            >
              Compare with Friend
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {toursInMonthPerYear.map((tours) => {
              return (
                <div>
                  <Line
                    className="mt-3"
                    data={{
                      labels: [
                        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Dezember',
                      ],
                      datasets: [
                        {
                          label: "# number of sporttypes per month",
                          data: [
                            tours.January,
                            tours.February,
                            tours.March,
                            tours.April,
                            tours.May,
                            tours.June,
                            tours.July,
                            tours.August,
                            tours.September,
                            tours.October,
                            tours.November,
                            tours.Dezember,
                          ],
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderWidth: 2,
                          skipNull: false,
                        },
                      ],
                    }}
                    height={400}
                    width={400}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        yAxes: {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      },
                    }}
                  />
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
    );
  } else if (selectedStatistic === "sportPerMonth" && compareStatus === true) {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
            <Form.Control
              className="mt-2"
              as="select"
              custom
              onChange={(e) => handleFriendInput(e)}
            >
              <option value="none">--Select Friend To Compare--</option>
              {listOfFriends.map((friend) => (
                <option value={friend.email}>{friend.username}</option>
              ))}
            </Form.Control>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                gettoursInMonthPerYearFriend();
              }}
            >
              Load Friend Data
            </Button>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleYearInput(e)}
            > 
              <option value="none">--Select Year--</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </Form.Control>
            <Button
              variant="outline-success"
              className="mt-3"
              onClick={() => {
                handleYear();
              }}
            >
              Select Year
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {toursInMonthPerYear.map((tours) => {
              return toursInMonthPerYearFriend.map((toursFriend) => {
                return (
                  <div>
                    <Line
                    className="mt-3"
                    data={{
                      labels: [
                        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Dezember',
                      ],
                      datasets: [
                        {
                          label: "# number of sporttypes per month",
                          data: [
                            tours.January,
                            tours.February,
                            tours.March,
                            tours.April,
                            tours.May,
                            tours.June,
                            tours.July,
                            tours.August,
                            tours.September,
                            tours.October,
                            tours.November,
                            tours.Dezember,
                          ],
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderWidth: 2,
                          skipNull: true,
                        },
                        {
                          label: "# number of sporttypes per month " + selectedFriend,
                          data: [
                            toursFriend.January,
                            toursFriend.February,
                            toursFriend.March,
                            toursFriend.April,
                            toursFriend.May,
                            toursFriend.June,
                            toursFriend.July,
                            toursFriend.August,
                            toursFriend.September,
                            toursFriend.October,
                            toursFriend.November,
                            toursFriend.Dezember,
                          ],
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderWidth: 2,
                          skipNull: true,
                        },
                      ],
                    }}
                    height={400}
                    width={400}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        yAxes: {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      },
                    }}
                  />
                  </div>
                );
              });
            })}
          </Col>
        </Row>
      </Container>
    );
  }

  else {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Control
              as="select"
              custom
              onChange={(e) => handleStatisticInput(e)}
            >
              <option value="none">--Select Statistic--</option>
              <option value="total">Total Sport Values</option>
              <option value="howoften">How Often Sporttypes</option>
              <option value="sportPerMonth">Sport per Month</option>
            </Form.Control>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Statistics);
