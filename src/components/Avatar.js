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
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

function Avatar({ url, color = "#353840", size = 20, ...rest }) {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: `url(${url})`,
        width: size,
        height: size,
        borderRadius: size / 2,
        // border: `2px solid ${color}`
      }}
      {...rest}
    />
  );
}

export default Avatar;
