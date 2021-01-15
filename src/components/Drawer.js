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
    width: 500,
    position: "relative",
  },

  inner: {
    width: 500,
    height: "100%",
    position: "absolute",
  },
});

function Drawer({ show, onShow, onFrame, children }) {
  const classes = useStyles();

  const cachedChildren = React.useRef(children);

  React.useEffect(() => {
    if (show) cachedChildren.current = children;
  }, [show, children]);

  const props = useSpring({
    config: { ...config.stiff, clamp: true, velocity: 100 },
    width: show ? 500 : 0,
    from: { width: 0 },
    onFrame: () => {
      void onFrame?.();
    },
    onRest: () => {
      if (show) void onShow?.();
    },
  });

  return (
    <animated.div style={{ width: props.width }} className={classes.root}>
      <div className={classes.inner}>
        {children}
        {/* {show ? children : cachedChildren.current} */}
      </div>
    </animated.div>
  );
}

export default Drawer;
