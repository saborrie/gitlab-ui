import React from "react";
import Loader from "../components/Loader";
import PillButton from "../components/PillButton";
import { useMutationUpdateIssueState, useQueryIssue } from "../services/issue";

function IssueStateButton({ projectPath, issueId }) {
  const issueQuery = useQueryIssue(issueId, { enabled: Boolean(issueId) });
  const updateState = useMutationUpdateIssueState();
  const [isSaving, setIsSaving] = React.useState(false);

  if (!issueQuery.data) {
    return <PillButton />;
  }

  return (
    <PillButton
      color={isSaving ? undefined : issueQuery.data?.state === "opened" ? "#2da160" : "#428fdc"}
      onClick={
        isSaving
          ? null
          : async () => {
              setIsSaving(true);
              try {
                await updateState.mutateAsync({
                  projectPath,
                  iid: issueQuery.data?.iid,
                  issueId,
                  stateEvent: issueQuery.data?.state === "opened" ? "CLOSE" : "REOPEN",
                });
              } finally {
                setIsSaving(false);
              }
            }
      }
    >
      {isSaving ? <Loader /> : issueQuery.data?.state === "opened" ? "Open" : "Closed"}
    </PillButton>
  );
}

export default IssueStateButton;
