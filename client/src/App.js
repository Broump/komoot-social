import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Login from "./components/login";
import Register from "./components/register";
import ProtectedRoute from "./components/protectedRoute";
import Profile from "./components/profile";
import Tours from "./components/tours";
import Statistics from "./components/statistics";
import Friends from "./components/friends";
import Feed from "./components/feed";
import axios from "axios";
import React from "react";

import { useHistory, withRouter } from "react-router";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

function App() {
  const [userIsAuth, setUserIsAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const isUserAuth = async () => {
    try {
      if (localStorage.getItem("token")) {
        setUserIsAuth(true);
        setCheckingAuth(true);
      } else {
        setUserIsAuth(false);
        setCheckingAuth(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    isUserAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div>
        <Router>
          <Navigation />
          <Route exact path="/"></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/register" component={Register}></Route>
          <ProtectedRoute
            exact
            path="/profile"
            component={withRouter(Profile)}
            isAuth={userIsAuth}
          />
          <ProtectedRoute
            exact
            path="/friends"
            component={withRouter(Friends)}
            isAuth={userIsAuth}
          />
          <ProtectedRoute
            exact
            path="/statistics"
            exact
            component={Statistics}
            isAuth={userIsAuth}
          />
          <ProtectedRoute
            exact
            path="/tours"
            exact
            component={Tours}
            isAuth={userIsAuth}
          />
          <Footer />
        </Router>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
export default App;
