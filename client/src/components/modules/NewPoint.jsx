import React, { useState, useEffect, createContext } from "react";
// const mongoose = require("mongoose");
import "./NewPoint.css";

const NewPoint = (props) => {
  const [name, setName] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleXChange = (event) => {
    setX(event.target.value);
  };

  const handleYChange = (event) => {
    setY(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    point = setName("");
    setX("");
    setY("");
  };

  return (
    <>
      <div className="container">
        <h1 class="newpoint-title">Add new point</h1>
        <div class="input_box">
          <label for="pointname">Point Name: </label>
          <input type="text" id="pointname" onChange={handleNameChange} value={name}></input>
          <br></br>
        </div>
        <div class="input_box">
          <label for="x_coord">
            Position on the <b>{props.left}</b> to <b>{props.right}</b> axis (between -12 and 12):
            {"  "}
          </label>
          <input type="text" id="x_coord" onChange={handleXChange} value={x}></input>
          <br></br>
        </div>
        <div class="input_box">
          <label for="y_coord">
            Position on the <b>{props.top}</b> to <b>{props.bottom}</b> axis (between -12 and 12):
            {"  "}
          </label>
          <input type="text" id="y_coord" onChange={handleYChange} value={y}></input>
          <br></br>
        </div>
        <button id="submit_point" onClick={handleSubmit}>
          Submit Point
        </button>
      </div>
    </>
  );
};

export default NewPoint;
