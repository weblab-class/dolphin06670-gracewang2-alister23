import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import { get, post } from "../../utilities";
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
      get("/api/my_charts").then((charts) => {
        charts.sort((a, b) => (a.name < b.name ? -1 : 1));
        setCharts(charts);
      });
    }
  }, [userId]);

  return (
    <div className="mycharts-container">
      <div className="title-container">
        <h1 className="mycharts-title">My Charts</h1>
      </div>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart._id} className="chart-card">
            <h2>{chart.name}</h2>
            <p>{chart.likes} heart-emoji</p> {/* REPLACE WITH HEART EMOJI */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCharts;
