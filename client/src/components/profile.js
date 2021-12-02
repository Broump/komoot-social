import React from "react";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile({ isAuth: isAuth, component: Component, ...rest }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [komootID, setKomootID] = useState("");

  useEffect(() => {
    axios
      .get("/api/user-data", {
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

  return (
    <div>
      <div>Username: {username}</div>
      <div>Email: {email}</div>
      <div>komootID: {komootID}</div>
    </div>
  );
}

export default withRouter(Profile);
