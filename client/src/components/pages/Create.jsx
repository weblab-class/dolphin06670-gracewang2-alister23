import React, { useEffect, useState, useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import NewPoint from "../modules/NewPoint";
import Chart from "../modules/Chart";

import "../../utilities.css";
import { get, post } from "../../utilities";
import "./Create.css";
import { UserContext } from "../App";

/**
 * Page for creating a new alignment chart.
 */
const Create = () => {
  const [chartId, setChartId] = useState("");
  const [points, setPoints] = useState([]);
  const { userId } = useContext(UserContext);

  // Create a new chart and set its ID
  useEffect(() => {
    const newChart = {
      name: "New Chart",
      owner_id: userId,
    };
    post("/api/chart/create", newChart)
      .then((chart) => {
        setChartId(chart._id);
      })
      .catch((err) => {
        console.error("Error sending POST request in Create.jsx: ", err);
      });
  }, [userId]);

  // Fetch all points for the current chart
  useEffect(() => {
    if (chartId) {
      get("/api/chart/${chartId}/points").then((fetchedPoints) => {
        setPoints(fetchedPoints);
      });
    }
  }, [chartId]);

  // When there's a new point, add it to the list of points
  const handleNewPoint = (newPoint) => {
    setPoints([...points, newPoint]);
  };

  return (
    <>
      <div className="Create-container">
        <Chart
          points={[
            { name: "ayl27", x: -2, y: -2 },
            { name: "lilian", x: 10, y: -10 },
            { name: "grace", x: 12, y: 12 },
            { name: "web.lab", x: 3.1415, y: 10 },
            { name: "buka buka", x: 0, y: 0 },
            { name: "l", x: -12, y: -12 },
          ]}
        />
        {/* <Chart /> */}

        {/* <Chart points={points} /> */}
        <NewPoint
          chartId={chartId}
          onNewPoint={handleNewPoint}
          left="potato"
          right="carrot"
          bottom="dominos"
          top="subway"
        />
      </div>
    </>
  );
};

export default Create;
