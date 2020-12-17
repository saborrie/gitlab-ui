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
    padding: 10,
    borderRadius: 2,
    // border: "1px solid white",
    height: "100%",
    overflow: "hidden",
    background: "#2a2c32",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
  },
  spacer: {
    flexGrow: 1,
  },
  ticketNumber: {
    color: "#f0f0f0",
    flexShrink: 0,
    fontSize: 11,
  },
  ticketContent: {
    flexShrink: 0,
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

Ticket.Content = function TicketContent({ children, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.content} {...rest}>
      {children}
    </div>
  );
};

Ticket.Spacer = function TicketSpacer({ children, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.spacer} {...rest}>
      {children}
    </div>
  );
};

Ticket.Number = function TicketNumber({ children, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.ticketNumber} {...rest}>
      {children}
    </div>
  );
};

export default React.forwardRef(Ticket);
