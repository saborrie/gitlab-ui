import React from "react";

const SystemIcons = ({ name }) => {
  // todo switch on icon name

  return (
    <svg style={{ display: "block", height: 12, width: 12 }}>
      <use href={`/system-note-icons.svg#${name}`} fill="rgb(224, 224, 224)"></use>
    </svg>
  );
};

export default SystemIcons;
