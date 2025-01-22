import React, { useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import NewPoint from "../modules/NewPoint";
import Chart from "../modules/Chart";

import "../../utilities.css";
import { post } from "../../utilities";
import "./Create.css";
import { UserContext } from "../App";

/**
 * Page for creating a new alignment chart.
 */
const Create = () => {
  console.log("Bruh");
  const [chartId, setChartId] = useState(133);
  console.log("chartId:", chartId);

  useEffect(() => {
    const createChart = async () => {
      try {
        const response = await post("/api/chart/create", { name: "New Chart" });
        setChartId(response._id);
      } catch (error) {
        console.error("Error Creating chart (Skissue):", error);
      }
    };

    createChart();
  }, []); //Runs once when page is loaded

  /*
  return (
    <>
      <div className="Create-container u-flex">
        <Chart
          points={[
            { name: "ayl27", x: -2, y: -2 },
            { name: "lilian", x: 10, y: -10 },
            { name: "grace", x: -12, y: -12 },
            { name: "web.lab", x: 3.1415, y: 10 },
            { name: "buka buka", x: 0, y: 0 },
          ]}
        />
        {}
        <NewPoint left="potato" right="carrot" bottom="dominos" top="subway" />
      </div>
    </>
  );
  */
};

export default Create;
