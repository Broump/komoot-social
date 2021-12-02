import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Login from "./components/login";
import Register from "./components/register";
import ProtectedRoute from "./components/protectedRoute";
import Profile from "./components/profile";
import Tours from "./components/tours";
import axios from "axios";
import React from "react";

import { useHistory } from "react-router";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

function App() {
  const [userIsAuth, setUserIsAuth] = useState(true);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("/api/isauth", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.status === "ok") {
          setUserIsAuth(true);
        }
        if (response.data.status === "error") {
          localStorage.removeItem("token");
        }
      });
  });

  return (
    <div>
      <Navigation />
      <Router>
        <Switch>
          <Route path="/" exact></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/register" exact component={Register}></Route>
          <ProtectedRoute path="/profile" component={Profile} isAuth={true} />
          <ProtectedRoute
            path="/statistics"
            component={Profile}
            isAuth={userIsAuth}
          />
          <ProtectedRoute
            path="/notion"
            component={Profile}
            isAuth={userIsAuth}
          />
          <ProtectedRoute path="/tours" component={Tours} isAuth={true} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
