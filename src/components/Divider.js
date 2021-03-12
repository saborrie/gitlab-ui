import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    height: 1,
    width: "calc(100% - 40px)",
    background: "#fafafa",
    margin: "auto",
  },
});

function Divider({}) {
  const classes = useStyles();

  return <div className={classes.root} />;
}

export default Divider;
