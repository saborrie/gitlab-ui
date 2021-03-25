import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  app: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
  },
  sidebar: {
    width: 64,
    padding: "20px 0",
    height: "100%",
    borderRight: "1px solid #131316",
    background: "#1c1d21",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    "& > :not(:first-child)": {
      marginTop: 8,
    },
  },
  root: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    flexDirection: "column",
    background: "#1c1d21",
  },
  topbar: {
    height: 56,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    padding: [[0, 24]],
    backgroundColor: "#2a2c32",
  },
  topbarSpacer: {
    width: 20,
  },
  topBarSpacerGrow: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    maxHeight: "calc(100% - 56px)",
    display: "flex",
  },
  contentArea: {
    height: "100%",
    flexGrow: 1,
  },
});

function App({ children }) {
  const classes = useStyles();
  return <div className={classes.app}>{children}</div>;
}

function Sidebar({ children }) {
  const classes = useStyles();
  return <div className={classes.sidebar}>{children}</div>;
}

function Root({ children }) {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
}

function Topbar({ children }) {
  const classes = useStyles();
  return <div className={classes.topbar}>{children}</div>;
}

function TopbarSpacer({ grow }) {
  const classes = useStyles();
  return <div className={clsx(classes.topbarSpacer, { [classes.topBarSpacerGrow]: grow })} />;
}

function Content({ children }) {
  const classes = useStyles();
  return <div className={classes.content}>{children}</div>;
}
function ContentArea({ children }) {
  const classes = useStyles();
  return <div className={classes.contentArea}>{children}</div>;
}

export default { App, Sidebar, Root, Topbar, TopbarSpacer, Content, ContentArea };
