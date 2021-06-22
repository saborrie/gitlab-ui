import React from "react";
import InvisibleInput from "../components/InvisibleInput";
import { useSetTitle, useTitle } from "./EditIssueProvider";

function IssueTitleEditor() {
  const title = useTitle();
  const setTitle = useSetTitle();

  return (
    <h1>
      <InvisibleInput
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value?.replace("\n", ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
    </h1>
  );
}

export default IssueTitleEditor;
