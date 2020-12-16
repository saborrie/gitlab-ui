import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    minHeight: 180,
  },
});

function Dropzone({ children, ...rest }, ref) {
  const classes = useStyles();

  return (
    <div ref={ref} className={classes.root} {...rest}>
      {children}
    </div>
  );
}

export default React.forwardRef(Dropzone);
