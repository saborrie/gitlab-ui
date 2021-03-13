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

    "&:hover": {
      border: "3px solid #666",
    },
    "&$selected": {
      border: "3px solid #bfbfbf",
    },
  },
  inner: {
    position: "relative",

    color: "white",
    textDecoration: "none",
    width: 30,
    height: 30,
    borderRadius: 4,
    background: "#353840",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    backgroundSize: "cover",
    // overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    border: "3px solid #bfbfbf",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "red",
    width: 12,
    height: 12,
    borderRadius: 6,
    border: "2px solid #1c1d21",
  },
});

function SidebarButton({ url, color = "#353840", to, badge, children, ...rest }) {
  const classes = useStyles();

  return (
    <NavLink activeClassName={classes.selected} to={to} className={classes.root}>
      <div
        className={classes.inner}
        style={{
          backgroundImage: `url(${url})`,
        }}
        {...rest}
      >
        {children}
        {badge && <div className={classes.badge}></div>}
      </div>
    </NavLink>
  );
}

export default SidebarButton;
