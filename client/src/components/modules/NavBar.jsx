import React from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

// GOOGLE_CLIENT_ID identifies your web application to Google's authentication service.
const GOOGLE_CLIENT_ID = "193900211776-o811gq70tbbp5g1c2e67eq1b1h6clce2.apps.googleusercontent.com";

/**
 * Navigation bar at the top of all pages.
 * Takes no props.
 */
const NavBar = () => {
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

        <NavLink
          to="/create"
          className={({ isActive }) => (isActive ? "NavBar-link-active" : "NavBar-link")}
        >
          Create
        </NavLink>

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
