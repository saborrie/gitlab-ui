import React from "react";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  root: {
    padding: [20, 20, 0],
    flexGrow: 1,
    height: 160,
    zIndex: 0,
    marginBottom: 20,
  },
  box: {
    padding: 2,
    borderRadius: 2,
    height: "100%",
    border: "2px dashed #2c2e35",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",

    "&:hover": {
      background: "#202227",
    },
  },
  listMode: {
    height: 40 + 20,
    // padding: "20px ",
  },
});

const NewTicketButton = React.forwardRef(function Ticket(
  { children, onClick, isListMode, ...rest },
  ref
) {
  const classes = useStyles();

  return (
    <div ref={ref} className={clsx(classes.root, { [classes.listMode]: isListMode })} {...rest}>
      <div className={classes.box} onClick={onClick}>
        {children}
      </div>
    </div>
  );
});

// export default React.forwardRef(Ticket);
export default NewTicketButton;
