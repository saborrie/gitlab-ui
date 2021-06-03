import React from "react";
import Loader from "../components/Loader";
import PillButton from "../components/PillButton";
import { useMutationUpdateIssueLabels, useQueryIssue } from "../services/issue";
import { useQueryGraphProject } from "../services/project";

function IssueLabelButton({ projectPath, issueId, label, shouldRemoveLabel }) {
  const project = useQueryGraphProject(projectPath);
  const issueQuery = useQueryIssue(issueId, { enabled: Boolean(issueId) });
  const updateLabels = useMutationUpdateIssueLabels();
  const [isSaving, setIsSaving] = React.useState(false);

  if (!issueQuery.data) {
    return <PillButton />;
  }

  const isSelected = Boolean(issueQuery.data?.labels.nodes?.find((x) => x.title === label));

  const labelData = project.data?.labels.nodes?.find((x) => x.title === label);

  return (
    <PillButton
      color={isSelected ? labelData.color : undefined}
      onClick={
        isSaving
          ? null
          : async () => {
              setIsSaving(true);
              try {
                const affect = isSelected
                  ? { removeLabels: [labelData] }
                  : {
                      addLabels: [labelData],
                      removeLabels: project.data?.labels.nodes?.filter(
                        shouldRemoveLabel || (() => false)
                      ),
                    };

                await updateLabels.mutateAsync({
                  projectPath,
                  iid: issueQuery.data?.iid,
                  issueId,
                  ...affect,
                });
              } finally {
                setIsSaving(false);
              }
            }
      }
    >
      {label}
    </PillButton>
  );
}

export default IssueLabelButton;
