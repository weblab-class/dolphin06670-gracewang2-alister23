import React, { useState, useEffect, createContext } from "react";
import "./Chart.css";
import "../../utilities.css";
import { get, post } from "../../utilities";
import Grid from "../../../images/grid.png";

const Chart = (props) => {
  const points = [];

  const displayPoint = (props) => {
    // const leftOffset =
    // const bottomOffset =

    // const x = ;
    // const y = ;
    const x = 7.3 + 3.56 * (12 + Number.parseFloat(props.point.x));
    const y = 1.5 + 3.53 * (12 + Number.parseFloat(props.point.y));
    points.push(
      <div
        key={props.point._id}
        className="pointContainer"
        style={{ left: x + "%", bottom: y + "%" }}
      >
        <span className="point"></span>
        <p className="pointName">{props.point.name}</p>
      </div>
    );
    console.log(points);
  };

  for (const datapoint in props.points) {
    displayPoint({ point: props.points[datapoint] });
  }

  return (
    <>
      <div className="Chart-container">
        <input type="text" defaultValue="top axis" id="top" className="axis"></input>
        <div className="horizontal">
          <input type="text" defaultValue="left axis" id="left" className="axis"></input>
          <div className="grid">
            <img src={Grid}></img>
            <div className="points">{points}</div>
          </div>
          <input type="text" defaultValue="right axis" id="right" className="axis"></input>
        </div>
        <input type="text" defaultValue="bottom axis" id="bottom" className="axis"></input>
        <br></br>
        <input type="text" defaultValue="chart name" id="name"></input>
      </div>
    </>
  );
};

export default Chart;
