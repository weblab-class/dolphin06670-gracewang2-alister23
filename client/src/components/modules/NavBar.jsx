import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { NavLink } from "react-router-dom";

import "../../utilities.css";
import { get, post, del, put } from "../../utilities";
import { UserContext } from "../App";

import "./NavBar.css";

// GOOGLE_CLIENT_ID identifies your web application to Google's authentication service.
const GOOGLE_CLIENT_ID = "193900211776-o811gq70tbbp5g1c2e67eq1b1h6clce2.apps.googleusercontent.com";

/**
 * Navigation bar at the top of all pages.
 * Takes no props.
 */
const NavBar = () => {
  const { userId } = useContext(UserContext);

  if (userId === undefined) {
    return <div>Loading...</div>;
  }

  // Create a new chart on the server
  const handleCreateClick = () => {
    const newChart = {
      name: "New Chart",
      owner_id: userId, // Replace with actual userId from context or props
    };

    post("/api/chart/create", newChart)
      .then((chart) => {
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
  };

  return (
    <nav className="NavBar-container">
      <div className="NavBar-left">
        <h1 className="NavBar-title">Alignify</h1>
      </div>

      <div className="NavBar-right">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "NavBar-link-active" : "NavBar-link")}
        >
          Home
        </NavLink>

        {/* <NavLink
          to="/create"
          className={({ isActive }) => (isActive ? "NavBar-link-active" : "NavBar-link")}
        >
          Create
        </NavLink> */}

        {/* Rewriting Create into a button */}
        <button onClick={handleCreateClick} className="NavBar-button">
          Create
        </button>

        <NavLink
          to="/mycharts"
          className={({ isActive }) => (isActive ? "NavBar-link-active" : "NavBar-link")}
        >
          My Charts
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }) => (isActive ? "NavBar-link-active" : "NavBar-link")}
        >
          Library
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
