import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import NewPoint from "../modules/NewPoint";
import Chart from "../modules/Chart";

import "../../utilities.css";
import { get, post, del, put } from "../../utilities";
import "./Create.css";
import { UserContext } from "../App";

/**
 * Page for creating a new alignment chart.
 */
const Create = () => {
  const [chartId, setChartId] = useState("");
  const [chart, setChart] = useState(null);
  const [points, setPoints] = useState([]);
  const { userId } = useContext(UserContext);
  const [left, setLeft] = useState("left");
  const [right, setRight] = useState("right");
  const [top, setTop] = useState("top");
  const [bottom, setBottom] = useState("bottom");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chartIdFromQuery = queryParams.get("chartId");

  // Create a new chart and set its ID
  // I know previous code used googleid, but I'm going to replace everything with _id for now.
  useEffect(() => {
    if (userId) {
      if (chartIdFromQuery) {
        get(`/api/chart/${chartIdFromQuery}`).then((chart) => {
          setChart(chart);
          setChartId(chart._id);
          setPoints(chart.points);
        });
      } else {
        const newChart = {
          name: "New Chart",
          owner_id: userId,
        };

        post("/api/chart/create", newChart)
          .then((chart) => {
            setChartId(chart._id);
            // When a chart is created, submit it to the database
            const chartData = {
              chartId: chart._id,
              userId: userId,
            };

            post("/api/chart/submit", chartData).then((user) => {
              console.log("Chart submitted: ", user);
            });
          })
          .catch((err) => {
            console.error("Error sending POST request in Create.jsx: ", err);
          });
      }
    }
  }, []);

  // Fetch all points and axes for the current chart
  useEffect(() => {
    if (chartId) {
      get(`/api/chart/${chartId}/points`).then((fetchedPoints) => {
        setPoints(fetchedPoints);
      });
    }
  }, [chartId]);

  // useEffect(() => {
  //   if (chartId) {
  //     get(`/api/chart/${chartId}/top`).then((top_axis) => {
  //       setTop(top_axis);
  //     });
  //   }
  // }, [chartId]);

  // I'm thinking that the problem is that sometimes userId is undefined, which gives a 400 error in our endpoint.
  // In this case, we should remind them to log in.
  if (!userId) {
    return <div>Please log in to create a chart.</div>;
  }

  // When there's a new point, add it to the list of points
  const handleNewPoint = (newPoint) => {
    setPoints([...points, newPoint]);
  };

  const handleChanged = () => {
    // console.log("changing");
    if (chartId) {
      get(`/api/chart/${chartId}`).then((chart) => {
        // console.log(chart[0].top_axis);
        setTop(chart[0].top_axis);
        // console.log(top);
      });
    }
  };

  return (
    <>
      <div className="Create-container">
        {/* <Chart
          points={[
            { name: "ayl27", x: -2, y: -2 },
            { name: "lilian", x: 10, y: -10 },
            { name: "grace", x: 12, y: 12 },
            { name: "web.lab", x: 3.1415, y: 10 },
            { name: "buka buka", x: 0, y: 0 },
            { name: "l", x: -12, y: -12 },
          ]}
        /> */}
        {/* <Chart /> */}

        <Chart points={points} chartId={chartId} onChanged={handleChanged} />
        <NewPoint
          chartId={chartId}
          onNewPoint={handleNewPoint}
          // left={left_axis}
          // right={right_axis}
          // bottom={bottom_axis}
          // top={top}
          left="left"
          right="right"
          bottom="bottom"
          top="top"
        />
      </div>
    </>
  );
};

export default Create;
