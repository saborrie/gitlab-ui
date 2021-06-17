import React from "react";
import { createUseStyles } from "react-jss";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils.js";

const useStyles = createUseStyles({
  root: {
    width: 20,
    height: 20,
    borderRadius: 4,
    // border: "1px solid white",
    color: "#bfbfbf",
    background: "#131316",
    // boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
});

function NumberIndicatorCircle({ color = "#353840", size = 20, ...rest }) {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{
        width: size,
        height: size,
        // borderRadius: size / 2,
      }}
      {...rest}
    />
  );
}

export default NumberIndicatorCircle;
