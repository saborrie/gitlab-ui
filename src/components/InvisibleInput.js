// -webkit-font-smoothing: antialiased;
// font: inherit;
// color: currentColor;
// width: 100%;
// border: 0;
// height: 1.3em;
// margin: 0;
// display: block;
// min-width: 0;
// background: none;
// animation-name: mui-auto-fill-cancel;
// -webkit-tap-highlight-color: transparent;
// box-sizing: border-box;
// font-family: 'Lato', sans-serif;
// outline: 0;

// text-align: center;
// -webkit-font-smoothing: antialiased;
// color: rgba(0, 0, 0, 0.87);
// cursor: text;
// display: inline-flex;
// position: relative;
// align-items: center;
// font-weight: 400;
// line-height: 1.1875em;
// letter-spacing: 0.00938em;
// height: 32px;
// padding: 0px 8px;
// flex-grow: 1;
// font-size: 14px;
// box-sizing: border-box;
// font-family: 'Lato', sans-serif;

import React from "react";
import { createUseStyles } from "react-jss";
import AutoTextArea from "./AutoTextarea";
const useStyles = createUseStyles({
  input: {
    // -webkit-font-smoothing: antialiased;
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: 0,
    height: "1.3em",
    margin: 0,
    display: "block",
    minWidth: 0,
    background: "none",
    tapHighlighColor: "transparent",
    boxSizing: "border-box",
    // font-family: 'Lato', sans-serif,
    outline: 0,
    resize: "none",
  },
});

function InvisibleInput(props) {
  const classes = useStyles();

  return <AutoTextArea className={classes.input} {...props}></AutoTextArea>;
}

export default InvisibleInput;
