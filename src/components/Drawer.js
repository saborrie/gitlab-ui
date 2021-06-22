import React from "react";
import { useTransition, animated, config, useSpring } from "react-spring";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";

const useStyles = createUseStyles({
  root: {
    flexShrink: 0,
    background: "#2c2e35",

    boxShadow: "0 0 10px -5px rgba(0, 0, 0, 0.8)",
    width: 0,
    height: "100%",
    width: 680,
    position: "relative",
  },

  inner: {
    width: 680,
    height: "100%",
    position: "absolute",
  },
});

function Drawer({ show, onShow, onFrame, children }) {
  const classes = useStyles();

  const styles = useSpring({
    from: { width: 0 },
    to: { width: show ? 680 : 0 },
    reverse: !show,
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
      clamp: true,
    },
    onChange: () => {
      void onFrame?.();
    },
    onRest: () => {
      if (show) void onShow?.();
    },
  });

  return (
    <animated.div style={{ width: styles.width }} className={classes.root}>
      <div className={classes.inner}>{children}</div>
    </animated.div>
  );
}

export default Drawer;
