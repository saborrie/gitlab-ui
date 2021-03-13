import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    padding: [[10, 20]],
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    flexGrow: 1,
    overflow: "auto",
  },
});

function List({ children }) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

export default List;
