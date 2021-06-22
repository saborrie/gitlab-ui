import React from "react";
import { createUseStyles } from "react-jss";
import { animated, useTransition, config } from "react-spring";

const useStyles = createUseStyles({
  root: {
    // outline: "1px solid red",
    // borderRadius: "10px",
  },
});

function Fader({ show, children, onRest }) {
  const classes = useStyles();

  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: show,
    config: { ...config.stiff, clamp: true },
    onRest: onRest,
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div className={classes.root} style={styles}>
          {children}
        </animated.div>
      )
  );
}

export default Fader;
