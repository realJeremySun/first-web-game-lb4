import { apiService } from "./APIServices";
export const authenticationService = {
  login,
  signup,
  logout
};

const axios = require("axios");

function login(email, password, self) {
  const data = {
    email: email,
    password: password
  };
  const header = {
    "Content-Type": "application/json"
  };
  return axios
    .post(apiService.login, data, header)
    .then(function(response) {
      localStorage.setItem("currentUser", response.data.token);
      self.props.history.push("/");
    })
    .catch(function(error) {
      if (!self.unmount) self.setState({ error });
    });
}

function signup(email, password, self) {
  const header = {
    "Content-Type": "application/json"
  };
  const data = {
    email: email,
    password: password,
    name: "nousername"
  };
  return axios
    .post(apiService.character, data, header)
    .then(function(response) {
      self.props.history.push("/login");
    })
    .catch(function(error) {
      if (!self.unmount) self.setState({ error });
    });
}

function logout() {
  console.log("logout");
  localStorage.removeItem("currentUser");
}
