import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    padding: "0px 16px",
    borderRadius: 8,
    background: "#2c2e35",
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    height: 30,
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.4)",
  },
  selected: {
    border: "2px solid white",
    padding: "0px 14px",
  },
});

function FloatingFooterPill({ children, selected, ...rest }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, { [classes.selected]: selected })} {...rest}>
      {children}
    </div>
  );
}

export default FloatingFooterPill;
