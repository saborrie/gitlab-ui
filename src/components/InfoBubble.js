import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    padding: "4px",
  },
});

function InfoBubble({ children }) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

export default InfoBubble;
