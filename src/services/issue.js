import React from "react";
import produce from "immer";
import { useToken } from "./auth";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://gitlab.com/api/graphql";

function useGraphQLClient() {
  const token = useToken();

  return React.useMemo(() => {
    return new GraphQLClient(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);
}

function useMutateQueryState() {
  const queryClient = useQueryClient();

  return React.useCallback(
    (key, mutator) => {
      const previousData = queryClient.getQueryData(key);
      const newData = produce(previousData, mutator);
      queryClient.setQueryData(key, newData);
      return () => queryClient.setQueryData(key, previousData);
    },
    [queryClient]
  );
}

export function useQueryIssue(id) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey }) => {
      const [key, x] = queryKey;

      const res = await graphQLClient.request(
        gql`
        query {
          issue(id:"${x}") {
            id
            iid
            title
            state
            assignees{
              nodes {
                avatarUrl
                name
              }
            }
            reference
            milestone { 
              title
            }
            labels {
              nodes {
                id
                color
                title
                textColor
              }
            }
            description

            currentUserTodos(state:pending) {
              nodes {
                id
                body
                targetType
                action
                state
                createdAt
              }
            }

            discussions {
              nodes {
                id
                notes {
                  nodes {
                    author {
                      avatarUrl
                      id
                      name
                    }
                    createdAt
                    body
                    system
                    systemNoteIconName
                    bodyHtml
                  }
                }
              }
            }
          }
        }
      `
      );
      return res.issue;
    },
    [graphQLClient]
  );

  return useQuery(["issue", id], execute, {
    enabled: Boolean(graphQLClient),
    refetchInterval: 15 * 1000,
  });
}

function useCreateNote() {
  const graphQLClient = useGraphQLClient();

  return React.useCallback(
    async ({ discussionId, issueId, body, clientMutationId }) => {
      const res = await graphQLClient.request(
        gql`
          mutation CreateNote(
            $issueId: NoteableID!
            $discussionId: DiscussionID
            $body: String!
            $clientMutationId: String
          ) {
            createNote(
              input: {
                noteableId: $issueId
                body: $body
                discussionId: $discussionId
                clientMutationId: $clientMutationId
              }
            ) {
              clientMutationId
            }
          }
        `,
        {
          issueId,
          discussionId,
          body,
          clientMutationId,
        }
      );
      return { issueId, discussionId, body };
    },
    [graphQLClient]
  );
}

export function useMutationCreateNote() {
  const createNote = useCreateNote();
  const queryClient = useQueryClient();

  return useMutation(createNote, {
    onSettled: (x) => {
      queryClient.invalidateQueries(["issue", x?.issueId]);
    },
  });
}

function useUpdateIssueState() {
  const graphQLClient = useGraphQLClient();

  return React.useCallback(
    async ({ projectPath, iid, stateEvent }) => {
      const res = await graphQLClient.request(
        gql`
          mutation ChangeIssueState(
            $projectPath: ID!
            $iid: String!
            $stateEvent: IssueStateEvent!
          ) {
            updateIssue(input: { projectPath: $projectPath, stateEvent: $stateEvent, iid: $iid }) {
              issue {
                id
                state
              }
            }
          }
        `,
        {
          projectPath,
          iid,
          stateEvent,
        }
      );
      return {
        projectPath,
        iid,
        state: res.updateIssue?.issue.state,
        issueId: res.updateIssue?.issue?.id,
      };
    },
    [graphQLClient]
  );
}

export function useMutationUpdateIssueState() {
  const updateIssueState = useUpdateIssueState();
  const mutateQueryState = useMutateQueryState();
  const queryClient = useQueryClient();

  return useMutation(updateIssueState, {
    onMutate: ({ issueId, stateEvent }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryClient.cancelQueries(["issue", issueId]);

      // Snapshot the previous value
      const previousIssueData = queryClient.getQueryData(["issue", issueId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["issue", issueId], {
        ...previousIssueData,
        state: stateEvent === "CLOSE" ? "closed" : "opened",
      });

      // Return a rollback function
      return () => queryClient.setQueryData(["issue", issueId], previousIssueData);
    },

    onError: (err, data, rollback) => rollback(),

    onSettled: (data) => {
      queryClient.invalidateQueries(["issue", data?.issueId]);
      // queryClient.invalidateQueries(["project", x?.projectPath, "issues"]);

      mutateQueryState(["project", data?.projectPath, "issues"], (issueList) => {
        const issueToUpdate = issueList.find((i) => i.id === data.issueId);
        if (issueToUpdate) issueToUpdate.state = data.state;
      });
    },
  });
}

function useUpdateIssueLabels() {
  const graphQLClient = useGraphQLClient();

  return React.useCallback(
    async ({ projectPath, iid, addLabels, removeLabels }) => {
      function formatLabelId(id) {
        return Number(id.slice("gid://gitlab/ProjectLabel/".length));
      }

      const res = await graphQLClient.request(
        gql`
          mutation ChangeIssueState(
            $projectPath: ID!
            $iid: String!
            $addLabelIds: [ID!]
            $removeLabelIds: [ID!]
          ) {
            updateIssue(
              input: {
                projectPath: $projectPath
                addLabelIds: $addLabelIds
                removeLabelIds: $removeLabelIds
                iid: $iid
              }
            ) {
              issue {
                id
                labels {
                  nodes {
                    id
                    color
                    title
                    textColor
                  }
                }
              }
              errors
            }
          }
        `,
        {
          projectPath,
          iid,
          addLabelIds: addLabels?.map((l) => formatLabelId(l.id)),
          removeLabelIds: removeLabels?.map((l) => formatLabelId(l.id)),
        }
      );

      return {
        projectPath,
        iid,
        issue: res.updateIssue.issue,
        issueId: res.updateIssue?.issue?.id,
      };
    },
    [graphQLClient]
  );
}

export function useMutationUpdateIssueLabels() {
  const updateIssueLabels = useUpdateIssueLabels();
  const queryClient = useQueryClient();
  const mutateQueryState = useMutateQueryState();

  return useMutation(updateIssueLabels, {
    onMutate: ({ issueId, addLabels, removeLabels }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryClient.cancelQueries(["issue", issueId]);

      // Snapshot the previous value
      const previousIssueData = queryClient.getQueryData(["issue", issueId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["issue", issueId], {
        ...previousIssueData,
        labels: {
          ...previousIssueData.labels,
          nodes: [...previousIssueData.labels.nodes, ...(addLabels || [])]
            .filter((l) => !removeLabels.find((rl) => rl.id === l.id))
            .sort((a, b) => {
              if (a.title < b.title) return -1;
              if (b.title < a.title) return 1;
              return 0;
            }),
        },
      });

      // Return a rollback function
      return () => queryClient.setQueryData(["issue", issueId], previousIssueData);
    },

    onError: (err, data, rollback) => rollback(),

    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries(["issue", data?.issueId]);

        mutateQueryState(["project", data?.projectPath, "issues"], (issueList) => {
          const issueToUpdate = issueList.find((i) => i.id === data.issue.id);
          if (issueToUpdate) issueToUpdate.labels = data.issue.labels.nodes;
        });
      }
    },
  });
}

function useCreateIssue() {
  const graphQLClient = useGraphQLClient();

  return React.useCallback(
    async ({ projectPath, title, description, labelIds = [], milestoneId, assigneeIds = [] }) => {
      const res = await graphQLClient.request(
        gql`
          mutation CreateIssue(
            $title: String!
            $description: String!
            $labelIds: [LabelID!]
            $milestoneId: MilestoneID
            $projectPath: ID!
            $assigneeIds: [UserID!]
          ) {
            createIssue(
              input: {
                title: $title
                description: $description
                labelIds: $labelIds
                milestoneId: $milestoneId
                projectPath: $projectPath
                assigneeIds: $assigneeIds
              }
            ) {
              issue {
                id
                iid
                title
              }
            }
          }
        `,
        {
          projectPath,
          title,
          description,
          labelIds,
          milestoneId,
          assigneeIds,
        }
      );
      return { projectPath, issueId: res.createIssue?.issue?.id };
    },
    [graphQLClient]
  );
}

export function useMutationCreateIssue() {
  const createIssue = useCreateIssue();
  const queryClient = useQueryClient();

  return useMutation(createIssue, {
    onSettled: (x) => {
      queryClient.invalidateQueries(["project", x?.projectPath, "issues"]);
    },
  });
}
