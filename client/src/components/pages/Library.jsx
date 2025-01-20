import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Library.css";
import { UserContext } from "../App";

/**
 * Page for viewing a library of most popular charts.
 */
const Library = () => {
  return <div className="library-container">Library of Most Popular Charts</div>;
};

export default Library;
