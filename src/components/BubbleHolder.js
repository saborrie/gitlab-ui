import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    display: "flex",
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 8,
    "& p:first-child": {
      margin: 0,
    },
  },
  left: {
    paddingRight: 6,
    display: "flex",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  right: {
    // flexShrink: 0,
  },
});

function Holder({ left, depth, spaced, fullWidth, children }) {
  const classes = useStyles();

  const leftWidth = depth == 0 ? 40 : 30;

  return (
    <div
      className={classes.root}
      style={{ paddingLeft: 16 + depth * 40, marginBottom: spaced ? 8 : 0 }}
    >
      <div className={classes.left} style={{ width: leftWidth }}>
        {left}
      </div>
      <div
        className={classes.right}
        style={{ width: `calc(100% - ${leftWidth})`, flexGrow: fullWidth ? 1 : null }}
      >
        {children}
      </div>
    </div>
  );
}

export default Holder;
