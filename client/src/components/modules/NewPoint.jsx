import React, { useState, useEffect, createContext } from "react";
// const mongoose = require("mongoose");
import "./NewPoint.css";
import "../../utilities.css";
import { get, post } from "../../utilities";
import { Point } from "@tsparticles/engine";
// import { set } from "core-js/core/dict";

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
        props.onNewPoint(response);
        setName("");
        setX("");
        setY("");
      })
      .catch((err) => {
        console.error("Error creating point: ", err);
      });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        // Find the submit button and trigger a click event
        const submitButton = document.getElementById("submit_point");
        if (submitButton) {
          submitButton.click();
        }
      }
    };
    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array to run this effect only once

  return (
    <body>
      <div className="container">
        <h1 className="newpoint-title">Add New Point</h1>
        <div className="input_box">
          <label htmlFor="pointname">Point Name: </label>
          <input type="text" id="pointname" onChange={handleNameChange} value={name}></input>
          <br></br>
        </div>
        <div className="input_box">
          <label htmlFor="x_coord">
            Position from <b>{props.left}</b> to <b>{props.right}</b> (between -12 and 12):
            {"  "}
          </label>
          <input type="text" id="x_coord" onChange={handleXChange} value={x}></input>
          <br></br>
        </div>
        <div className="input_box">
          <label htmlFor="y_coord">
            Position from <b>{props.top}</b> to <b>{props.bottom}</b> (between -12 and 12):
            {"  "}
          </label>
          <input type="text" id="y_coord" onChange={handleYChange} value={y}></input>
          <br></br>
        </div>
        <button id="submit_point" onClick={handleSubmit}>
          Submit Point
        </button>
      </div>
    </body>
  );
};

export default NewPoint;
