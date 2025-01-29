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
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (userId) {
      get("/api/public_charts").then((charts) => {
        // Sort by name.
        // I kind of want to sort by timestamp but I don't think we'll have the time to implement that.
        charts.sort((a, b) => (a.name < b.name ? -1 : 1));
        setCharts(charts);

        // Fetch user details for each chart.
        charts.forEach((chart) => {
          get(`/api/user/${chart.owner_id}`).then((user) => {
            setUserDetails((prev) => ({
              ...prev,
              [chart.owner_id]: user.name,
            }));
          });
        });
      });
    }
  }, [userId]);

  if (!userId) {
    return (
      <div>Oops! It seems like you need to log in (on the home page) to view the library.</div>
    );
  }

  return (
    <div className="library-container">
      <div className="title-container">
        <h1 className="library-title">Library of Public Charts</h1>
      </div>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart._id} className="chart-card">
            <h2>{chart.name}</h2>
            <p>Created by: {userDetails[chart.owner_id]}</p>
            <p>{chart.likes} ❤️</p> {/* REPLACE WITH HEART EMOJI */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
