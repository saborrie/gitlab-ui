import React from "react";
import Scrollbars from "react-custom-scrollbars";
import DrawerSection from "../components/DrawerSection";
import InvisibleInput from "../components/InvisibleInput";
import PillButton from "../components/PillButton";
import { useMutationCreateIssue } from "../services/issue";

function NewIssueContainer({ projectPath, goToIssue, labelId, milestoneId }) {
  // label query, get label by Id?
  // milestone query get milestone by Id?

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createIssue = useMutationCreateIssue();

  async function handleSubmit() {
    const res = await createIssue.mutateAsync({
      projectPath,
      title,
      description,
      milestoneId,
      labelIds: [labelId], // TODO support additional labels
      // TODO add assigneeIds
    });

    if (goToIssue) goToIssue(res?.issueId);
  }

  return (
    <Scrollbars>
      <DrawerSection flex>
        <PillButton onClick={handleSubmit}>Create issue</PillButton>
      </DrawerSection>

      <DrawerSection>
        <h1>
          <InvisibleInput
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </h1>
        <br />
        <br />
        {/* TODO add labels here. */}

        <div>
          <InvisibleInput
            placeholder="Issue description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </DrawerSection>
    </Scrollbars>
  );
}

export default NewIssueContainer;
