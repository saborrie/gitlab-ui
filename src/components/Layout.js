import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
    flexDirection: "column",
  },
  topbar: {
    height: 56,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    padding: [[0, 24]],
    backgroundColor: "#2a2c32",
  },
  content: {
    flexGrow: 1,
    maxHeight: "calc(100% - 56px)",
    display: "flex",
  },
});

function Root({ children }) {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
}

function Topbar({ children }) {
  const classes = useStyles();
  return <div className={classes.topbar}>{children}</div>;
}

function Content({ children }) {
  const classes = useStyles();
  return <div className={classes.content}>{children}</div>;
}

export default { Root, Topbar, Content };
