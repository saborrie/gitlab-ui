import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    height: 14,
    borderRadius: 4,
    // border: "1px solid white",
    color: "#bfbfbf",
    background: "#131316",
    // boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    overflow: "hidden",
    fontSize: 16,
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 10,
    fontSize: 10,
  },
  track: {
    width: 100,
    height: 2,
  },
  bar: {
    background: "white",
    height: "100%",
  },
});

function ProgressBar({ total, value }) {
  const classes = useStyles();
  const percentageComplete = (value / Math.max(1, total)) * 100;

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        {value} / {total}
      </div>
      <div className={classes.track}>
        <div className={classes.bar} style={{ width: `${percentageComplete}%` }}></div>
      </div>
    </div>
  );
}

export default ProgressBar;
