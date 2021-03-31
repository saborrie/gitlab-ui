import React from "react";
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
      return { projectPath, iid, issueId: res.updateIssue?.issue?.id };
    },
    [graphQLClient]
  );
}

export function useMutationUpdateIssueState() {
  const updateIssueState = useUpdateIssueState();
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

    onSettled: (x) => {
      queryClient.invalidateQueries(["issue", x?.issueId]);
      queryClient.invalidateQueries(["project", x?.projectPath, "issues"]);
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
