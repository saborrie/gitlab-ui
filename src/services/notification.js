import React from "react";
import { useToken } from "./auth";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import useSound from "use-sound";
import mp3Clearly from "../audio/file-sounds-1143-clearly.mp3";

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

export function usePlayNotification() {
  const [play] = useSound(mp3Clearly);
  return play;
}

export function useQueryTodos(projectId) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey }) => {
      const [key, projectId] = queryKey;

      const res = await graphQLClient.request(
        gql`
          query {
            currentUser {
              todos(projectId: "${projectId}") {

                nodes {

                  project {
                    id
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

  return useQuery(["todos", projectId], execute, {
    enabled: Boolean(graphQLClient),
    refetchInterval: 15 * 1000,
  });
}

// export function useNotifyOnNewTodo() {

//   const todosQuery = useQueryTodos();
//   const playNotification = usePlayNotification();

//   React.useEffect(() => {

//     if(todosQuery.data.)

//   }, [todosQuery.dataUpdatedAt])

// }
