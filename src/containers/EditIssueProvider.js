import React from "react";
import { useMutationUpdateIssueAndDescription } from "../services/issue";

const Ctx = React.createContext();

function EditIssueProvider({ projectPath, issue, title, description, children }) {
  const mutate = useMutationUpdateIssueAndDescription();

  const [state, setState] = React.useState({ title, description });

  React.useLayoutEffect(() => {
    setState({ title, description });
  }, [title, description]);

  const hasUnsavedChanges = !(title === state.title && description === state.description);

  const resetChanges = React.useCallback(() => {
    setState({ title, description });
  }, [setState, description, title]);

  const saveChanges = React.useCallback(async () => {
    console.log("saving changes: ", {
      hasUnsavedChanges,
      title,
      description,
      state,

      titleEqual: state.title === title,
      descriptionEqual: state.description === description,
    });

    await mutate.mutateAsync({
      projectPath,
      iid: issue?.iid,
      title: state.title !== title ? state.title : undefined,
      description: state.description !== description ? state.description : undefined,
    });
  }, [
    projectPath,
    issue?.iid,
    mutate,
    setState,
    description,
    title,
    state.title,
    state.description,
  ]);

  return (
    <Ctx.Provider value={{ state, setState, hasUnsavedChanges, resetChanges, saveChanges }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTitle() {
  return React.useContext(Ctx)?.state?.title;
}
export function useDescription() {
  return React.useContext(Ctx)?.state?.description;
}

export function useSetTitle() {
  const { setState } = React.useContext(Ctx);

  return React.useCallback(
    (title) => {
      setState((x) => ({ ...x, title }));
    },
    [setState]
  );
}

export function useSetDescription() {
  const { setState } = React.useContext(Ctx);

  return React.useCallback(
    (description) => {
      setState((x) => ({ ...x, description }));
    },
    [setState]
  );
}

export function useHasUnsavedChanges() {
  const { hasUnsavedChanges } = React.useContext(Ctx);
  return hasUnsavedChanges;
}

export function useResetChanges() {
  const { resetChanges } = React.useContext(Ctx);
  return resetChanges;
}
export function useSaveChanges() {
  const { saveChanges } = React.useContext(Ctx);
  return saveChanges;
}

export default EditIssueProvider;
