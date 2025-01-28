import React, { useContext, useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import { get, post, del, put } from "../../utilities";
import "./Library.css";
import { UserContext } from "../App";

/**
 * Page for viewing a library of most popular charts.
 */
const Library = () => {
  const { userId } = useContext(UserContext);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    get("/api/chart/public_charts").then((charts) => {
      // Sort by name.
      // I kind of want to sort by timestamp but I don't think we'll have the time to implement that.
      charts.sort((a, b) => (a.name < b.name ? -1 : 1));
      setCharts(charts);
    });
  }, []);

  return (
    <div className="library-container">
      <div className="title-container">
        <h1 className="library-title">Library of Public Charts</h1>
      </div>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart._id} className="chart-card">
            <h2>{chart.name}</h2>
            <p>Created by: {chart.owner_id.name}</p>
            <p>{chart.likes} ❤️</p> {/* REPLACE WITH HEART EMOJI */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
