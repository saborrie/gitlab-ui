import React from "react";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  root: {
    padding: [20, 20, 0],
    flexGrow: 1,
    height: 160,
    "&:last-child": {
      marginBottom: 20,
    },
    zIndex: 0,
  },
  box: {
    padding: 10,
    borderRadius: 2,
    // border: "1px solid white",
    height: "100%",
    overflow: "hidden",
    background: "#2c2e35",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
  },
  spacer: {
    flexGrow: 1,
  },
  ticketInfo: {
    color: "#f0f0f0",
    flexShrink: 0,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    height: 20,
  },
  ticketContent: {
    flexShrink: 0,
  },
  faded: {
    opacity: 0.4,
  },
});

const Ticket = React.forwardRef(function Ticket({ children, faded, ...rest }, ref) {
  const classes = useStyles();

  return (
    <div ref={ref} className={clsx(classes.root, { [classes.faded]: faded })} {...rest}>
      <div className={classes.box}>{children}</div>
    </div>
  );
});

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

Ticket.Info = function TicketInfo({ children, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.ticketInfo} {...rest}>
      {children}
    </div>
  );
};

// export default React.forwardRef(Ticket);
export default Ticket;
