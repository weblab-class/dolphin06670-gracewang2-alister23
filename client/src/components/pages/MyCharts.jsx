import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import { get, post, del, put } from "../../utilities";
import "./MyCharts.css";
import { UserContext } from "../App";

import ShareModal from "../modules/ShareModal";

/**
 * Page for viewing my charts and charts that are shared with me.
 */
const MyCharts = () => {
  const { userId } = useContext(UserContext);
  const [charts, setCharts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedChartName, setSelectedChartName] = useState("New Chart");
  const [error, setError] = useState(""); // I don't know if we actually need this.
  const navigate = useNavigate();

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
    return <div>Please log in to view your charts.</div>; // Make this prettier.
  }

  const handleDelete = (chartId) => {
    console.log("Deleting chart: ", chartId);
    del(`/api/chart/${chartId}`).then(() => {
      setCharts((charts) => charts.filter((chart) => chart._id !== chartId));
      console.log("charts length: ", charts.length);
    });
  };

  const handleShare = (chartId) => {
    setIsModalOpen(true);
    setSelectedChart(chartId);
    if (chartId) {
      get(`/api/chart/name/${chartId}`).then((name) => {
        setSelectedChartName(name);
      });
    }
  };

  const handleShareSubmit = (email, permission) => {
    // Only sharing with a specific user; we can have a separate button to "Make Public" or "Make Private".
    put("/api/chart/share", { chartId: selectedChart, email: email, permission: permission })
      .then((response) => {
        console.log("Success! Chart shared: ", response);
      })
      .catch((err) => {
        console.error("Failed to share chart: ", err);
        setError("Oops! Something went wrong when sharing the chart. Can you try again?");
      });
  };

  // Handles the button that makes a chart public or private
  const togglePublic = (chartId, isPublic) => {
    const status = isPublic ? "private" : "public"; // If it's currently public, it should be private, and vice versa.
    console.log("status in MyCharts.jsx frontend (before put): ", status);
    // Update backend with new status via a POST request.
    put(`/api/chart/status/${chartId}`, { status: status })
      .then(() => {
        // Update charts on the frontend.
        setCharts((charts) =>
          charts.map((chart) => (chart._id === chartId ? { ...chart, isPublic: !isPublic } : chart))
        );
      })
      .catch((err) => {
        console.error("Oops! Failed to update chart status (public or private): ", err);
      });
  };

  const handleEdit = (chartId) => {
    navigate(`/create?chartId=${chartId}`); // Ensure the URL matches the route defined in index.jsx
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
            <p>{chart.likes} ❤️</p> {/* REPLACE WITH HEART EMOJI */}
            <button onClick={() => handleDelete(chart._id)}>Delete</button>
            <button onClick={() => handleShare(chart._id)}>Share</button>
            <button onClick={() => handleEdit(chart._id)}>Edit</button>
            <button
              className="toggle-public-button"
              onClick={() => togglePublic(chart._id, chart.isPublic)}
            >
              {chart.isPublic ? "Make Private" : "Make Public"}
            </button>
          </div>
        ))}
      </div>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShare={handleShareSubmit}
        chartName={selectedChartName}
      />
    </div>
  );
};

export default MyCharts;
