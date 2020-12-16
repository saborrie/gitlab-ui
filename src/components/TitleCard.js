import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    padding: 4,
    borderRadius: 4,
    border: "1px solid white",
    flexGrow: 1,
    height: 40,
  },
});

function TitleCard({ children }) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

export default TitleCard;
