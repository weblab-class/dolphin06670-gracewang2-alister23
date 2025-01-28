import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import { get, post, del } from "../../utilities";
import "./MyCharts.css";
import { UserContext } from "../App";

/**
 * Page for viewing my charts and charts that are shared with me.
 */
const MyCharts = () => {
  const { userId } = useContext(UserContext);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    if (userId) {
      get("/api/my_charts", { userId: userId }).then((charts) => {
        console.log("My charts: ", charts);
        charts.sort((a, b) => (a.name < b.name ? -1 : 1));
        setCharts(charts);
      });
    }
  }, [userId]);

  // If the user is not logged in, remind them to log in.
  if (!userId) {
    return <div>Please log in to view your charts.</div>;
  }

  const handleDelete = (chartId) => {
    console.log("Deleting chart: ", chartId);
    del(`/api/chart/${chartId}`).then(() => {
      setCharts((charts) => charts.filter((chart) => chart._id !== chartId));
      console.log("charts length: ", charts.length);
    });
  };

  return (
    <div className="mycharts-container">
      <div className="title-container">
        <h1 className="mycharts-title">Created by Me</h1>
      </div>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart._id} className="chart-card">
            <h2>{chart.name}</h2>
            <p>{chart.likes} heart-emoji</p> {/* REPLACE WITH HEART EMOJI */}
            <button onClick={() => handleDelete(chart._id)}>Delete</button>
            <button>Share</button>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCharts;
