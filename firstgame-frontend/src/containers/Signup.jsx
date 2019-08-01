import React, { Component } from "react";
import { authenticationService } from "../services";

class Signup extends Component {
  unmount = false;
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      error: null,
      submitted: false,
      loading: false,
      shortPassword: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;

    this.setState({ submitted: true });
    if (!(email && password && confirmPassword)) {
      return;
    }
    if (password.length < 8) {
      this.setState({ shortPassword: true });
      return;
    }
    if (password !== confirmPassword) {
      return;
    }

    this.setState({ loading: true });

    authenticationService.signup(email, password, this).then(
      function() {
        if (!this.unmount) this.setState({ loading: false });
      }.bind(this)
    );
  };

  render() {
    const {
      email,
      password,
      confirmPassword,
      error,
      loading,
      submitted,
      shortPassword
    } = this.state;
    return (
      <React.Fragment>
        <h2>Signup</h2>
        {error && error.response.data.error.statusCode === 400 && (
          <div className={"alert alert-danger"}>This email already exists </div>
        )}
        {error && error.response.data.error.statusCode !== 400 && (
          <div className={"alert alert-danger"}>Unknow error</div>
        )}
        <form name="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            {submitted && !email && (
              <div className="alert alert-danger">email is required</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            {submitted && !password && (
              <div className="alert alert-danger">Password is required</div>
            )}
            {submitted && shortPassword && (
              <div className="alert alert-danger">
                Password too short - minimum length is 8 characters
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
            />
            {submitted && !password && (
              <div className="alert alert-danger">
                Confirm Password is required
              </div>
            )}
            {submitted && password !== confirmPassword && (
              <div className="alert alert-danger">Password doesn't match</div>
            )}
          </div>

          <div className="form-group">
            <button className="btn btn-primary" disabled={loading}>
              Signup
            </button>
            {loading && (
              <img
                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                alt="loading"
              />
            )}
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export { Signup };
