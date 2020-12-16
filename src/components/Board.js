import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    // background: "yellow",
    height: "100%",
    overflow: "scroll",
  },
  row: {
    display: "flex",
    // overflowX: "auto",
  },
  rowHeader: {
    position: "sticky",
    left: 0,
    top: 80,
    background: "#2a2c32",
    padding: 20,
  },
  cell: {
    width: 220,
    minHeight: 220,
    flexShrink: 0,
  },
  headerRow: {
    display: "flex",
    position: "sticky",
    top: 0,
    background: "#2a2c32",
    // overflowX: "auto",
    // "&::-webkit-scrollbar": {
    //   display: "none",
    // },
    // "-ms-overflow-style": "none",
    // scrollbarWith: "none",
  },
  columHeader: {
    width: 220,
    height: 80,
    flexShrink: 0,
    padding: 20,
    background: "#2a2c32",
  },
});

const BoardScrollContext = React.createContext(null);

function Root({ children }) {
  const classes = useStyles();
  return (
    <BoardScrollContext.Provider>
      <div className={classes.root}>{children}</div>
    </BoardScrollContext.Provider>
  );
}
function Row({ children }) {
  const classes = useStyles();
  return <div className={classes.row}>{children}</div>;
}
function RowHeader({ children }) {
  const classes = useStyles();
  return <div className={classes.rowHeader}>{children}</div>;
}
function Cell({ children }) {
  const classes = useStyles();
  return <div className={classes.cell}>{children}</div>;
}
function HeaderRow({ children }) {
  const classes = useStyles();
  return <div className={classes.headerRow}>{children}</div>;
}
function ColumnHeader({ children }) {
  const classes = useStyles();
  return <div className={classes.columHeader}>{children}</div>;
}

export default { Root, Row, RowHeader, Cell, HeaderRow, ColumnHeader };
