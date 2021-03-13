import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";
import { Link, NavLink } from "react-router-dom";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils.js";

const useStyles = createUseStyles({
  root: {
    width: 46,
    height: 46,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textDecoration: "none",

    "&:hover $inner": {
      background: "#353840",
      boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    },
    "&$selected $inner": {
      background: "#353840",
      boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    },
  },
  inner: {
    color: "white",
    textDecoration: "none",
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundSize: "cover",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

function AddButton({ url, color = "#353840", to, ...rest }) {
  const classes = useStyles();

  return (
    <NavLink activeClassName={classes.selected} to={to} className={classes.root}>
      <div className={classes.inner} {...rest} />
    </NavLink>
  );
}

export default AddButton;
