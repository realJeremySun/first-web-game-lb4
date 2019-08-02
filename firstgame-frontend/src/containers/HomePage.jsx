import React, { Component } from "react";
import { Display, InitCharacter } from "../components";
import "./style.css";

class HomePage extends Component {
  componentDidMount() {
    const { handelUserData, data } = this.props;
    if (!data) this.props.history.push("/login");
    handelUserData();
  }

  render() {
    const { data, gear, currentUser, handelUserData } = this.props;

    return (
      <React.Fragment>
        <div className="basic">
          {data.name !== "nousername" && (
            <h2>
              LV.{data.level} {data.name}
            </h2>
          )}
          {data.name !== "nousername" && (
            <Display className="basic" data={data} gear={gear} />
          )}

          {data.name === "nousername" && (
            <InitCharacter
              className="basic"
              currentUser={currentUser}
              data={data}
              handelUserData={handelUserData}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export { HomePage };
