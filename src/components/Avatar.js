import React from "react";
import { createUseStyles } from "react-jss";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils.js";

const useStyles = createUseStyles({
  root: {
    width: 20,
    height: 20,
    borderRadius: 10,
    background: "#353840",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    backgroundSize: "cover",
  },
});

function Avatar({ url, color = "#353840" }) {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: `url(${url})`,

        // border: `2px solid ${color}`
      }}
    />
  );
}

export default Avatar;
