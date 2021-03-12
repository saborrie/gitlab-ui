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
            title
            assignees{
              nodes {
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
      console.log("onsettled:", x);

      queryClient.invalidateQueries(["issue", x?.issueId]);
    },
  });
}
