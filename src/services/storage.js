import React from "react";
import { createContainer } from "react-tracked";

function useLocallyPersistedReducer(reducer, defaultState, storageKey, init = null) {
  const hookVars = React.useReducer(reducer, defaultState, (defaultState) => {
    const persisted = JSON.parse(localStorage.getItem(storageKey));
    return persisted !== null ? persisted : init !== null ? init(defaultState) : defaultState;
  });

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(hookVars[0]));
  }, [storageKey, hookVars[0]]);

  return hookVars;
}

const initialState = {
  projects: [],
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "addProject": {
      if (state.projects.includes(payload)) {
        return state;
      } else {
        return { ...state, projects: [...state.projects, payload] };
      }
    }
    case "removeProject": {
      return { ...state, projects: state.projects.filter((x) => x !== payload) };
    }
    default: {
      return state;
    }
  }
}

function useAppState() {
  return useLocallyPersistedReducer(reducer, initialState, "app");
}

export const { Provider, useTracked } = createContainer(useAppState);

function createUseAction(type, f) {
  return function () {
    const [, dispatch] = useTracked();
    return React.useCallback(
      function (...args) {
        dispatch({ type, payload: f(...args) });
      },
      [dispatch, f]
    );
  };
}

export function useSavedProjects() {
  const [{ projects }] = useTracked();
  return projects;
}

export const useAddProject = createUseAction("addProject", (id) => id);
export const useRemoveProject = createUseAction("removeProject", (id) => id);
