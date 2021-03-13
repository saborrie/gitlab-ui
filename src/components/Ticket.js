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
    padding: 2,
    borderRadius: 2,
    // border: "1px solid white",
    height: "100%",
    // overflow: "hidden",
    // background: "#2c2e35",
    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
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
    "& $inner": {
      opacity: 0.4,
    },
  },
  selected: {
    border: "2px solid white",
    padding: 0,
  },
  innerWrapper: {
    position: "relative",
    height: "100%",
    flexGrow: 1,
  },
  inner: {
    padding: 8,
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
    background: "#2c2e35",
    display: "flex",
    flexDirection: "column",
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

const Ticket = React.forwardRef(function Ticket(
  { children, badge, faded, selected, ...rest },
  ref
) {
  const classes = useStyles();

  return (
    <div ref={ref} className={classes.root} {...rest}>
      <div className={clsx(classes.box, { [classes.faded]: faded, [classes.selected]: selected })}>
        <div className={classes.inner}>{children}</div>
        {badge && <div className={classes.badge}></div>}
      </div>
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
