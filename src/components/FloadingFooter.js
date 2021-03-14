import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    position: "sticky",
    bottom: 16,
    left: 80,
    marginLeft: 100,
    maxWidth: "calc(100% - 200px)",
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 16px 0",
    borderRadius: "8px",
    // background: "#1c1d21",

    "&::before": {
      content: '""',
      width: 8,
      height: 8,
      borderRadius: 4,
      background: "red",
      marginRight: 12,
      marginBottom: 8,
    },
  },
  inner: {
    display: "flex",
    flexWrap: "wrap",

    "& > *": {
      marginBottom: 8,
      marginLeft: 8,
    },
  },
});

function FloatingFooter({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>{children}</div>
    </div>
  );
}

export default FloatingFooter;
