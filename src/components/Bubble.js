import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    padding: "8px 12px",
    borderRadius: 18,
    background: "#3f414b",

    "& p": {
      margin: "2px 0",
    },

    "& img": {
      maxWidth: "100%",
      display: "block",
      margin: "auto",
    },

    "& a": {
      color: "#b3c6ff",
    },
  },
  highlighted: {
    border: "2px solid red",
  },
});

function Bubble({ children, highlighted }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, { [classes.highlighted]: highlighted })}>{children}</div>
  );
}

export default Bubble;
