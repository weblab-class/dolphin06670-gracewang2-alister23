import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./MyCharts.css";
import { UserContext } from "../App";

/**
 * Page for viewing my charts and charts that are shared with me.
 */
const MyCharts = () => {
  return <div className="mycharts-container">View My Charts + Charts Shared with Me</div>;
};

export default MyCharts;
