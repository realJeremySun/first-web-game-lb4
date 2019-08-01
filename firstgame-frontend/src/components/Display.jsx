import React, { Component } from "react";
import { DropdownButton, Dropdown, Table } from "react-bootstrap";
import "./style.css";

class Display extends Component {
  render() {
    const { data, gear } = this.props;
    return (
      <React.Fragment>
        <Table striped bordered hover variant="dark">
          <tbody>
            <tr>
              <th>EXP</th>
              <th>
                {data.currentExp}/{data.nextLevelExp}
              </th>
            </tr>
            <tr>
              <th>HP</th>
              <th>
                {data.currentHealth}/{data.maxHealth}
              </th>
            </tr>
            <tr>
              <th>MP</th>
              <th>
                {data.currentMana}/{data.maxMana}
              </th>
            </tr>
            <tr>
              <th>Attack</th>
              <th>{data.attack}</th>
            </tr>
            <tr>
              <th>defence</th>
              <th>{data.defence}</th>
            </tr>

            <tr>
              <th>
                <DropdownButton
                  title="weapon"
                  variant="danger"
                  id="weapon"
                  key="weapon"
                >
                  {gear[0] === "no weapon" && (
                    <Dropdown.Item eventKey="1"> {gear[0]}</Dropdown.Item>
                  )}
                  {gear[0] && gear[0] !== "no weapon" && (
                    <Dropdown.Item eventKey="1">{gear[0].name} </Dropdown.Item>
                  )}
                  {gear[0] && gear[0] !== "no weapon" && (
                    <Dropdown.Item eventKey="1">
                      Attack: {gear[0].attack}{" "}
                    </Dropdown.Item>
                  )}
                  {gear[0] && gear[0] !== "no weapon" && (
                    <Dropdown.Item eventKey="1">
                      Defence: {gear[0].defence}{" "}
                    </Dropdown.Item>
                  )}
                </DropdownButton>
              </th>

              <th>
                <DropdownButton
                  title="armor"
                  variant="primary"
                  id="armor"
                  key="armor"
                >
                  {gear[1] === "no armor" && (
                    <Dropdown.Item eventKey="1"> {gear[1]}</Dropdown.Item>
                  )}
                  {gear[1] && gear[1] !== "no armor" && (
                    <Dropdown.Item eventKey="1">{gear[1].name} </Dropdown.Item>
                  )}
                  {gear[1] && gear[1] !== "no armor" && (
                    <Dropdown.Item eventKey="1">
                      Attack: {gear[1].attack}{" "}
                    </Dropdown.Item>
                  )}
                  {gear[1] && gear[1] !== "no armor" && (
                    <Dropdown.Item eventKey="1">
                      Defence: {gear[1].defence}{" "}
                    </Dropdown.Item>
                  )}
                </DropdownButton>
              </th>

              <th>
                <DropdownButton
                  title="skill"
                  variant="success"
                  id="skill"
                  key="skill"
                >
                  {gear[2] === "no skill" && (
                    <Dropdown.Item eventKey="2"> {gear[2]}</Dropdown.Item>
                  )}
                  {gear[2] && gear[2] !== "no skill" && (
                    <Dropdown.Item eventKey="1">{gear[1].name} </Dropdown.Item>
                  )}
                  {gear[2] && gear[2] !== "no skill" && (
                    <Dropdown.Item eventKey="1">
                      Attack: {gear[2].attack}{" "}
                    </Dropdown.Item>
                  )}
                  {gear[2] && gear[2] !== "no skill" && (
                    <Dropdown.Item eventKey="1">
                      Cost: {gear[2].cost}{" "}
                    </Dropdown.Item>
                  )}
                </DropdownButton>
              </th>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export { Display };
