import React from "react";
import { createUseStyles } from "react-jss";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils.js";

const useStyles = createUseStyles({
  root: {
    padding: 10,
    borderRadius: 2,
    background: "#353840",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.4)",
    flexGrow: 1,
    height: 40,
  },
});

function TitleCard({ children, color }) {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={
        color
          ? {
              background: color,
              color: pickTextColorBasedOnBgColorAdvanced(color, "#f0f0f0", "black"),
            }
          : {}
      }
    >
      {children}
    </div>
  );
}

export default TitleCard;
