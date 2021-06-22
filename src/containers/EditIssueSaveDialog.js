import React from "react";
import Bubble from "../components/Bubble";
import Fader from "../components/Fader";
import PillButton from "../components/PillButton";
import { useHasUnsavedChanges, useResetChanges, useSaveChanges } from "./EditIssueProvider";
import Loader from "../components/Loader";

function EditIssueSaveDialog() {
  const hasUnsavedChanges = useHasUnsavedChanges();
  const resetChanges = useResetChanges();
  const saveChanges = useSaveChanges();
  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <Fader
      show={hasUnsavedChanges}
      onRest={() => {
        setIsSaving(false);
      }}
    >
      <Bubble>
        <div style={{ display: "flex", alignItems: "center" }}>
          Unsaved changes. <div style={{ width: 10 }} />
          <PillButton
            color={isSaving ? undefined : "#ffffff"}
            onClick={
              isSaving
                ? null
                : async () => {
                    setIsSaving(true);
                    try {
                      await saveChanges();
                    } catch {
                      setIsSaving(false);
                    }
                  }
            }
          >
            {isSaving ? <Loader /> : "Save"}
          </PillButton>
          {!isSaving && <div style={{ width: 10 }} />}
          {!isSaving && (
            <PillButton color="#686c7d" onClick={isSaving ? null : () => resetChanges()}>
              Cancel
            </PillButton>
          )}
        </div>
      </Bubble>
    </Fader>
  );
}

export default EditIssueSaveDialog;
