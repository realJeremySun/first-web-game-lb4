import { authenticationService } from "./AuthServices";
import { apiService } from "./APIServices";

export const userService = {
  getUserData,
  getGearData,
  initCharacter
};

const axios = require("axios");

function getUserData(currentUser, self) {
  axios
    .get(apiService.character, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .then(function(response) {
      //console.log(response.data);
      self.setState({ data: response.data });
    })
    .catch(function(error) {
      authenticationService.logout();
    });
}

function getGearData(currentUser, self) {
  axios
    .get(apiService.updatecharacter, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .then(function(response) {
      //console.log(response.data);
      self.setState({ gear: response.data });
    })
    .catch(function(error) {
      authenticationService.logout();
    });
}

function initCharacter(currentUser, name, gear, self) {
  const URL = apiService.changename + `?name=${name}`;
  const header = {
    Authorization: `Bearer ${currentUser}`
  };
  const data = {
    name: name
  };
  console.log(URL);
  console.log(currentUser);

  axios
    .patch(apiService.changename, data, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .then(function(response) {
      //console.log(response.data);
      //self.setState({ gear: response.data });
    })
    .catch(function(error) {
      //authenticationService.logout();
    });
  //   axios
  //     .patch(URL, header)
  //     .then(function(response) {
  //       console.log(response.data);
  //       self.setState({ data: response.data });
  //     })
  //     .catch(function(error) {
  //       authenticationService.logout();
  //     })
  //     .then(function() {
  //       if (!self.unmount) self.setState({ loading: false });
  //     });
}
