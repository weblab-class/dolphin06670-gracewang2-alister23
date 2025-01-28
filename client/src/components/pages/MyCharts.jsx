import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import { get, post, del } from "../../utilities";
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
  const [liked, setLiked] = useState({});

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

  useEffect(() => {
    const updatedLikes = {};
    for (const chart of charts) {
      updatedLikes[chart._id] = chart.likes;
    }
    setLiked(updatedLikes);
  });

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
      get(`/api/chart/${chartId}/name`).then((name) => {
        setSelectedChartName(name);
      });
    }
  };

  const handleLike = (chartId) => {
    if (chartId) {
      if (liked) {
        post(`/api/chart/${chartId}/unlike`)
          .then((likes) => {
            console.log(likes);
          })
          .catch((error) => {
            console.error("error when unliking chart:", error);
          });
        setLiked(false);
      } else {
        post(`/api/chart/${chartId}/like`)
          .then((likes) => {
            console.log(likes);
          })
          .catch((error) => {
            console.error("error when liking chart:", error);
          });
        setLiked(true);
      }
    }
  };

  const handleShareSubmit = (shareWith) => {
    // Only sharing with a specific user; we can have a separate button to "Make Public" or "Make Private".
    console.log("Sharing chart with: ", shareWith);
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
            <p>{chart.likes} 💜</p>
            <button onClick={() => handleDelete(chart._id)}>Delete</button>
            <button onClick={() => handleShare(chart._id)}>Share</button>
            <button>Edit</button>
            <button onClick={() => handleLike(chart._id)}>Like</button>
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
