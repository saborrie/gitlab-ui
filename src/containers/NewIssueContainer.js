import React from "react";
import Scrollbars from "react-custom-scrollbars";
import InvisibleInput from "../components/InvisibleInput";

function NewIssueContainer() {
  // label query, get label by Id?
  // milestone query get milestone by Id?

  return (
    <Scrollbars>
      <div style={{ paddingLeft: 24, paddingTop: 10, paddingRight: 10, paddingBottom: 24 }}>
        <h1>
          <InvisibleInput placeholder="Issue title" />
        </h1>
        <br />
        <br />
        {/* TODO add labels here. */}

        <div>
          <InvisibleInput placeholder="Issue description" />
        </div>
      </div>
    </Scrollbars>
  );
}

export default NewIssueContainer;
