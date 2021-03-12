import React from "react";
import InvisibleInput from "../components/InvisibleInput";
import { useMutationCreateNote } from "../services/issue";

function CreateNote({ issueId, discussionId }) {
  const createNote = useMutationCreateNote();
  const [body, setBody] = React.useState("");

  return (
    <InvisibleInput
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder={discussionId ? "Reply to discussion..." : "Start new discussion..."}
      onKeyPress={async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          await createNote.mutateAsync({ issueId, discussionId, body });
          setBody("");
        }
      }}
    />
  );
}

export default CreateNote;
