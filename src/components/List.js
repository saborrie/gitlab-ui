import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    padding: [[40, 20]],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

function List({ children }) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

export default List;
