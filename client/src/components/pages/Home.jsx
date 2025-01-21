import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Home.css";
import ParticlesComponent from "./Particles.jsx";
import { UserContext } from "../App";
import FirstDoodle from "../../../images/beaver-with-magnifying-glass.png";
import SecondDoodle from "../../../images/beaver-with-chart.png";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
      {/* Particles Background */}
      {/* <ParticlesComponent className="particles" /> */}

      {/* Stock Image Background (for now) */}
      <img
        src="../../../images/dotted-lines.png"
        alt="Stock Image of Dotted Lines"
        className="dotted-line-image"
      />

      {/* Title Box */}
      <div className="home-container">
        <div className="title-box">
          <h1 className="title">Alignify</h1>
          <p className="description">
            Create, share, and explore alignment charts like never before.
          </p>
        </div>

        {/* Authentication */}
        <div className="authentication">
          {userId ? (
            <button
              className="logout-button"
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
