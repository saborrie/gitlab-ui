import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils";
const useStyles = createUseStyles({
  root: {
    height: 24,
    padding: "0 8px",
    borderRadius: 4,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    overflowY: "hidden",
  },
});

function PillButton({ color = "#3f414b", children, ...rest }) {
  const classes = useStyles();

  const fg = pickTextColorBasedOnBgColorAdvanced(color, "white", "black");

  return (
    <div className={classes.root} style={{ color: fg, background: color }} {...rest}>
      {children}
    </div>
  );
}

export default PillButton;
