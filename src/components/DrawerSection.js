import clsx from "clsx";
import React from "react";

import { createUseStyles } from "react-jss";
const useStyles = createUseStyles({
  root: {
    paddingLeft: 24,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 24,
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  spacer: {
    width: 10,
  },
  grow: {
    flexGrow: 1,
  },
});

function DrawerSection({ children, flex }) {
  const classes = useStyles();

  return <div className={clsx(classes.root, { [classes.flex]: flex })}>{children}</div>;
}

DrawerSection.Spacer = function Spacer({ grow }) {
  const classes = useStyles();

  return <div className={clsx(classes.spacer, { [classes.grow]: grow })} />;
};

export default DrawerSection;
