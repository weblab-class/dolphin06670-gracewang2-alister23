import React, { useState, useEffect, createContext } from "react";
// const mongoose = require("mongoose");
import "./NewPoint.css";
import { set } from "core-js/core/dict";

const NewPoint = (props) => {
  const [name, setName] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [parent, setParent] = useState(props.chartId);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleXChange = (event) => {
    setX(event.target.value);
  };

  const handleYChange = (event) => {
    setY(event.target.value);
  };

  // On click of button, create new point document in database + post to points
  const handleSubmit = (event) => {
    event.preventDefault();

    const pointData = {
      name: name,
      x_coord: x,
      y_coord: y,
      parent: props.chartId,
    };

    post("/api/point", pointData)
      .then((response) => {
        console.log("Point created: ", response);
        setName(name);
        setX(x);
        setY(y);
      })
      .catch((err) => {
        console.error("Error creating point: ", err);
      });
  };

  return (
    <>
      <div className="container">
        <h1>Add New Point</h1>
        <label for="pointname">Point Name: </label>
        <input type="text" id="pointname" onChange={handleNameChange} value={name}></input>
        <br></br>
        <label for="x_coord">
          Position on the <b>{props.left}</b> to <b>{props.right}</b> axis (between -12 and 12):
        </label>
        <input type="text" id="x_coord" onChange={handleXChange} value={x}></input>
        <br></br>
        <label for="y_coord">
          Position on the <b>{props.top}</b> to <b>{props.bottom}</b> axis (between -12 and 12):
        </label>
        <input type="text" id="y_coord" onChange={handleYChange} value={y}></input>
        <br></br>
        <button id="submit_point" onClick={handleSubmit}>
          Submit Point
        </button>
      </div>
    </>
  );
};

export default NewPoint;
