import React, { useState, useEffect, createContext } from "react";
import "./Chart.css";
import "../../utilities.css";
import { get, post, del, put } from "../../utilities";
import Grid from "../../../images/grid.png";
import Plot from "react-plotly.js";
import { Responsive } from "@tsparticles/engine";

const Chart = (props) => {
  const points = [];

  //Called when top axis changes
  const topChanged = (event) => {
    event.preventDefault();
    const newVal = event.target.value;
    const chartId = props.chartId;
    put(`/api/charts/${chartId}/top`, {
      top_axis: newVal,
    });
  };
  //Called when left axis changes
  const leftChanged = (event) => {
    event.preventDefault();
    const newVal = event.target.value;
    const chartId = props.chartId;
    put(`/api/charts/${chartId}/left`, {
      left_axis: newVal,
    });
  };
  //Called when right axis changes
  const rightChanged = (event) => {
    event.preventDefault();
    const newVal = event.target.value;
    const chartId = props.chartId;
    put(`/api/charts/${chartId}/right`, {
      right_axis: newVal,
    });
  };
  //Called when bottom axis changes
  const bottomChanged = (event) => {
    event.preventDefault();
    const newVal = event.target.value;
    const chartId = props.chartId;
    put(`/api/charts/${chartId}/top`, {
      bottom_axis: newVal,
    });
  };

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

  for (const i in props.points) {
    // displayPoint({ point: props.points[datapoint] });
    const datapoint = props.points[i];
    // console.log(datapoint);
    x_points.push(datapoint.x);
    y_points.push(datapoint.y);
    labels.push(datapoint.name);
  }

  return (
    <>
      <div className="container">
        <input
          type="text"
          defaultValue="top axis"
          id="top"
          className="axis"
          onChange={topChanged}
        ></input>
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
              layout={{ width: 400, height: 380 }}
              // config={{ responsive: true }}
            />
          </div>
          <input
            type="text"
            defaultValue="right axis"
            id="right"
            className="axis"
            onChange={rightChanged}
          ></input>
        </div>
        <input
          type="text"
          defaultValue="bottom axis"
          id="bottom"
          className="axis"
          onChange={bottomChanged}
        ></input>
        <br></br>
        <input type="text" defaultValue="chart name" id="name"></input>
      </div>
    </>
  );
};

export default Chart;
