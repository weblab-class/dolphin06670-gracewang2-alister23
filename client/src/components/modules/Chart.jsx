import React, { useState, useEffect, createContext } from "react";
import "./Chart.css";
import "../../utilities.css";
import { get, post } from "../../utilities";
import Grid from "../../../images/grid.png";
import Plot from "react-plotly.js";
import { Responsive } from "@tsparticles/engine";

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

  const x_points = [];
  const y_points = [];
  const labels = [];

  for (const datapoint in props.points) {
    // displayPoint({ point: props.points[datapoint] });
    x_points.push(datapoint.x_coord);
    y_points.push(datapoint.y_coord);
    labels.push(datapoint.name);
  }

  return (
    <>
      <div className="Chart-container">
        <input type="text" defaultValue="top axis" id="top" className="axis"></input>
        <div className="horizontal">
          <input type="text" defaultValue="left axis" id="left" className="axis"></input>
          <div className="grid" id="tester">
            <Plot
              data={[
                {
                  x: x_points,
                  y: y_points,
                  type: "scatter",
                  mode: "markers+text",
                  text: labels,
                  marker: { color: "#705fbb" },
                  textposition: "bottom center",
                },
              ]}
              layout={{ width: 360, height: 240 }}
              // config={{ responsive: true }}
            />
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
