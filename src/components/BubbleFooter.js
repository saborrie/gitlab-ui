import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    padding: "0px 18px",
    fontSize: 12,
  },
});

function BubbleFooter({ children }) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

export default BubbleFooter;
