import React, { Component } from "react";
import { userService, gearList } from "../services";
import "./style.css";

class InitCharacter extends Component {
  unmount = false;
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      error: null,
      submitted: false,
      loading: false,
      lastClick: null
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
    const { name, lastClick } = this.state;
    const { currentUser } = this.props;

    //console.log(currentUser);
    //console.log(data);

    this.setState({ submitted: true });
    if (!name && !lastClick) {
      return;
    }

    this.setState({ loading: true });
    console.log(lastClick.id);

    let gear = {};

    switch (lastClick.id) {
      case 1:
        gear = {
          weapon: gearList.weapons.guideBookJunior,
          armor: gearList.armors.silkRobe,
          skill: gearList.skills.sacrifice
        };
      case 2:
        gear = {
          weapon: gearList.weapons.surgicalDagger,
          armor: gearList.armors.labCoat,
          skill: gearList.skills.bloodLetting
        };
      case 3:
        gear = {
          weapon: gearList.weapons.rustyShortSword,
          armor: gearList.armors.chainArmor,
          skill: gearList.skills.slap
        };
        break;
    }

    userService.initCharacter(currentUser, name, gear, this);
  };

  handelClick = e => {
    const { lastClick } = this.state;
    e.target.classList.toggle("open");
    if (lastClick) lastClick.classList.toggle("open");
    this.setState({ lastClick: e.target });
  };

  handleSubmit() {}
  render() {
    const { name, submitted, loading } = this.state;
    return (
      <React.Fragment>
        <div className="panels">
          <div id="1" className="panel panel1" onClick={this.handelClick}>
            <p className="classes">Demon Scholar</p>
          </div>
          <div id="2" className="panel panel2" onClick={this.handelClick}>
            <p className="classes">Plague Doctor</p>
          </div>
          <div id="3" className="panel panel3" onClick={this.handelClick}>
            <p className="classes knight">Knight of Madness</p>
          </div>
        </div>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="text" htmlFor="name">
              Character Name
            </label>
            <input
              type="name"
              className="form-control"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            {submitted && !name && (
              <div className="alert alert-danger">
                Character name is required
              </div>
            )}
          </div>
          <div className="form-group button">
            <button className="btn btn-primary button" disabled={loading}>
              Start
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

export { InitCharacter };
