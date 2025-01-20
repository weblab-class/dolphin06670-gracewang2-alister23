import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";
import FirstDoodle from "../../../images/beaver-with-magnifying-glass.png";
import SecondDoodle from "../../../images/beaver-with-chart.png";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
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

      {/* Adding doodles to the homepage. */}
      <div className="doodles">
        <img
          src={FirstDoodle}
          alt="Beaver Holding Magnifying Glass and Peering at Chart"
          className="left-doodle"
        />
        <img src={SecondDoodle} alt="Cute Beaver Holding Chart" className="right-doodle" />
      </div>
    </>
  );
};

export default Home;
