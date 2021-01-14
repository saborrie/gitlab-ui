import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    padding: [[20, 20]],
    borderRadius: 2,
    background: "#353840",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.4)",
    flexGrow: 1,
    // height: 24,
    marginBottom: 20,
    color: "white",
    textDecoration: "none",
    display: "block",
    width: 600,
  },
  title: {
    fontSize: 18,
  },
});

function ListItem({ children, component = "div", ...props }) {
  const classes = useStyles();

  const C = component;

  return (
    <C className={classes.root} {...props}>
      {children}
    </C>
  );
}

ListItem.Title = function ListItemTitle({ children }) {
  const classes = useStyles();

  return <div className={classes.title}>{children}</div>;
};

export default ListItem;
