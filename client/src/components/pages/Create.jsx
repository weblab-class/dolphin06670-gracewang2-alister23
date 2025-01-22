import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import NewPoint from "../modules/NewPoint";
import Chart from "../modules/Chart";

import "../../utilities.css";
import "./Create.css";
import { UserContext } from "../App";

/**
 * Page for creating a new alignment chart.
 */
const Create = () => {
  return (
    <>
      <div className="Create-container u-flex">
        <Chart
          points={[
            { name: "ayl27", x: -2, y: -2 },
            { name: "lilian", x: 10, y: -10 },
            { name: "grace", x: -12, y: -12 },
          ]}
        />
        {/* <Chart /> */}
        <NewPoint left="potato" right="carrot" bottom="dominos" top="subway" />
      </div>
    </>
  );
};

export default Create;
