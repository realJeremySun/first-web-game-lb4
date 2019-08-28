import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Login, Signup, HomePage } from "./containers";
import { userService, authenticationService } from "./services";
import "./containers/style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "",
      data: {},
      gear: {}
    };
    this.handelLogout = this.handelLogout.bind(this);
    this.handelUserData = this.handelUserData.bind(this);
  }
  componentDidMount() {
    this.handelUserData();
  }

  handelLogout() {
    authenticationService.logout();
    this.setState({ currentUser: "", data: {}, gear: {} });
  }

  handelUserData() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      this.setState({ currentUser });
      userService.getUserData(currentUser, this);
      userService.getGearData(currentUser, this);
    }
  }

  render() {
    const { gear, data, currentUser } = this.state;
    return (
      <div className="jumbotron">
        <NavBar data={data} onLogout={this.handelLogout} />
        <div className="container basic">
          <div className="col-sm-8 col-sm-offset-2 basic">
            <Router>
              <div>
                <Route
                  exact
                  path="/"
                  render={props =>
                    localStorage.getItem("currentUser") ? (
                      <HomePage
                        {...props}
                        currentUser={currentUser}
                        data={data}
                        gear={gear}
                        handelUserData={this.handelUserData}
                      />
                    ) : (
                      <Redirect
                        to={
                        {
                          pathname: "/login",
                          state: { from: props.location }
                        }
                        }
                      />
                    )
                  }
                />
                <Route
                  path="/login"
                  render={props => (
                    <Login {...props} handelUserData={this.handelUserData} />
                  )}
                />
                <Route path="/signup" component={Signup} />
              </div>
            </Router>
          </div>
        </div>
        <div className="text-center">
          <p>
            <a href="https://loopback.io/">Powered by Loopback 4</a>
          </p>
          <p>
            <a href="https://github.com/gobackhuoxing/first-web-game-lb4">
              Github@gobackhuoxing
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export { App };