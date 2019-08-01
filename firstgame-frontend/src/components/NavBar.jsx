import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";

class NavBar extends Component {
  render() {
    const { data, onLogout } = this.props;
    //console.log(data.name);
    return (
      <Navbar>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {data.name && data.name !== "nousername" && (
            <Navbar.Text>Signed in as: {data.name}</Navbar.Text>
          )}
          {data.name && (
            <Button
              variant="secondary"
              size="sm"
              href="/login"
              onClick={onLogout}
            >
              logout
            </Button>
          )}
          {!data.name && (
            <Button variant="secondary" size="sm" href="/login">
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export { NavBar };
