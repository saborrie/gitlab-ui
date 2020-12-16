import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    padding: [20, 20, 0],
    flexGrow: 1,
    height: 160,
    "&:last-child": {
      paddingBottom: 20,
    },
  },
  box: {
    padding: 4,
    borderRadius: 0,
    border: "1px solid white",
    height: "100%",
    overflow: "hidden",
    background: "#2a2c32",
  },
});

function Ticket({ children, ...rest }, ref) {
  const classes = useStyles();

  return (
    <div ref={ref} className={classes.root} {...rest}>
      <div className={classes.box}>{children}</div>
    </div>
  );
}

export default React.forwardRef(Ticket);
