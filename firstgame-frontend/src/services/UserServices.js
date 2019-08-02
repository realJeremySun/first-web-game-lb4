import { authenticationService } from "./AuthServices";
import { apiService } from "./APIServices";

export const userService = {
  getUserData,
  getGearData,
  changeCharacterName,
  initCharacter,
  changeWeapon,
  changeArmor,
  changeSkill
};

const axios = require("axios");

function getUserData(currentUser, self) {
  axios
    .get(apiService.character, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .then(function(response) {
      self.setState({ data: response.data });
    })
    .catch(function() {
      authenticationService.logout();
    });
}

function getGearData(currentUser, self) {
  axios
    .get(apiService.updatecharacter, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .then(function(response) {
      self.setState({ gear: response.data });
    })
    .catch(function() {
      authenticationService.logout();
    });
}

function changeCharacterName(currentUser, name, self) {
  const data = {
    name: name
  };
  axios
    .patch(apiService.changename, data, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .catch(function(error) {
      if (error.response && error.response.data.error.statusCode === 401)
        authenticationService.logout();
      else if (!self.unmount) self.setState({ error });
    });
}

function initCharacter(currentUser, name, gear, self) {
  const data = {
    name: name,
    gear
  };
  return axios
    .patch(apiService.initCharacter, data, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .catch(function(error) {
      if (error.response && error.response.data.error.statusCode === 401)
        authenticationService.logout();
      else if (!self.unmount) self.setState({ error });
    });
}

function changeWeapon(currentUser, gear, self) {
  axios
    .patch(apiService.updateweapon, gear.weapon, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .catch(function(error) {
      if (error.response && error.response.data.error.statusCode === 401)
        authenticationService.logout();
      else if (!self.unmount) self.setState({ error });
    });
}

function changeArmor(currentUser, gear, self) {
  axios
    .patch(apiService.updatearmor, gear.armor, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .catch(function(error) {
      if (error.response && error.response.data.error.statusCode === 401)
        authenticationService.logout();
      else if (!self.unmount) self.setState({ error });
    });
}

function changeSkill(currentUser, gear, self) {
  axios
    .patch(apiService.updateskill, gear.skill, {
      headers: { Authorization: `Bearer ${currentUser}` }
    })
    .catch(function(error) {
      if (error.response && error.response.data.error.statusCode === 401)
        authenticationService.logout();
      else if (!self.unmount) self.setState({ error });
    });
}
