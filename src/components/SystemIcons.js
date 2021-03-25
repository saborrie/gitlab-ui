import React from "react";

const SystemIcons = ({ name, color = "rgb(224, 224, 224)" }) => {
  // todo switch on icon name

  return (
    <svg style={{ display: "block", height: 12, width: 12 }}>
      <use href={`/system-note-icons.svg#${name}`} fill={color}></use>
    </svg>
  );
};

export default SystemIcons;
