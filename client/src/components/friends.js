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
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

function Friends({ isAuth: isAuth, component: Component, ...rest }) {
  const [foundUsers, setFoundUsers] = useState([]);
  const [listOfFriends, setListOfFriends] = useState([]);
  const [userToFind, setUserToFind] = useState("");

  console.log("Search: " + foundUsers)
  console.log("Found User: "+ foundUsers)
  console.log("list of friends: "+ listOfFriends)

  const deleteFriend = async (friendToDelete) => {
    try {
      const deleteUser = await axios
        .get("/api/delete-friend", {
          headers: {
            "x-access-token": localStorage.getItem("token"),
            usertodelete: friendToDelete,
          },
        })
        .then((response) => {
          setListOfFriends(listOfFriends.slice(friendToDelete));
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const user = await axios.get("/api/search-user", {
        headers: {
          user: userToFind,
        },
      });
      if (user) {
        setFoundUsers(user.data);
      }

      if (user.status === "error") {
        alert("User not Found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchInput = (e) => {
    setUserToFind(e.target.value);
  };

  const handleAddFriend = (friendEmail) => {
    axios.get("/api/add-friend", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
        email: friendEmail,
      },
    });
    setListOfFriends([...listOfFriends, friendEmail]);
    setFoundUsers([]);
  };

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

  useEffect(() => {
    getListOfFriends();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search for User"
              classname=""
              aria-lable="Search"
              onChange={(e) => {
                handleSearchInput(e);
              }}
            ></FormControl>
            <Button
              variant="outline-success"
              onClick={() => {
                handleSearch();
              }}
            >
              Search
            </Button>
          </Form>
          {foundUsers.length !== 0 ? (
            <Container>
              <Card style={{ width: "20rem" }} className="mt-4">
                <Card.Title>Result:</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    {foundUsers.username} / {foundUsers.email}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              <Button
                varian="outline-succes"
                className="mt-3"
                onClick={() => {
                  handleAddFriend(foundUsers.email);
                }}
              >
                Add Friend
              </Button>
            </Container>
          ) : (
            <p></p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {listOfFriends.length > 0 ? (
            <div>
              <Card style={{ width: "35rem" }} className="mt-4">
                <Card.Title>Friends:</Card.Title>
                <ListGroup variant="flush">
                  {listOfFriends.map((friend) => (
                    <div>
                      <ListGroup.Item>{friend}</ListGroup.Item>
                      <Button
                        className="m-2"
                        variant="danger"
                        onClick={() => deleteFriend(friend)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </ListGroup>
              </Card>
            </div>
          ) : (
            <h3>Search for Friends</h3>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default withRouter(Friends);
