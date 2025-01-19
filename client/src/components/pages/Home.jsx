import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <div className="home-container">
      <div className="title-box">
        <h1 className="title">Alignment Charts</h1>
        <p className="description">
          Create, share, and explore alignment charts like never before.
        </p>
      </div>

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
  );
};

export default Home;
