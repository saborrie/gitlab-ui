import React from "react";
import { useToken } from "./auth";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQueryErrorResetBoundary,
} from "react-query";
import parse from "parse-link-header";
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

function useLoadProjectMeta() {
  const token = useToken();

  return React.useCallback(async (key, projectId) => {
    const result = await fetch(`https://gitlab.com/api/v4/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await result.json();
  });
}

export function useGetProjectMeta(projectId) {
  const loadProjectMeta = useLoadProjectMeta();
  return useQuery(["project", projectId, "meta"], loadProjectMeta);
}

// async function loadLabels(key, projectId) {
//   const result = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/labels`, {
//     headers: {
//       Authorization: "Bearer token",
//     },
//   });

//   return await result.json();
// }

// export function useGetLabels(projectId) {
//   return useQuery(["project", projectId, "labels"], loadLabels);
// }

// async function loadMilestones(key, projectId) {
//   const result = await fetch(
//     `https://gitlab.com/api/v4/projects/${projectId}/milestones?include_parent_milestones=true`,
//     {
//       headers: {
//         Authorization: "Bearer token",
//       },
//     }
//   );

//   return await result.json();
// }

// export function useGetMilestones(projectId) {
//   return useQuery(["project", projectId, "milestones"], loadMilestones);
// }

// async function loadAllIssues(key, projectId) {
//   const issueList = [];

//   const timer = window.performance.now();

//   let nextLink = `https://gitlab.com/api/v4/projects/${projectId}/issues?per_page=100`;

//   while (nextLink) {
//     const req = await fetch(nextLink, {
//       headers: {
//         Authorization: "Bearer token",
//       },
//     });

//     const newIssues = await req.json();
//     newIssues.forEach((item) => issueList.push(item));

//     const linkHeader = req.headers.get("link");
//     const links = parse(linkHeader);

//     nextLink = links?.next?.url;
//   }

//   const ms = window.performance.now() - timer;

//   console.log(`done in ${ms / 1000} seconds!`);
//   return issueList;
// }

// export function useGetIssues(projectId) {
//   return useQuery(["project", projectId, "issues"], loadAllIssues);
// }

function useReorderIssue() {
  const token = useToken();

  return React.useCallback(
    async function reorderIssue({ fullPath, issue, issueAfter, issueBefore, milestoneId, labels }) {
      function formatIssueId(id) {
        return Number(id.slice("gid://gitlab/Issue/".length));
      }
      function formatMilestoneId(id) {
        return Number(id.slice("gid://gitlab/Milestone/".length));
      }

      const projectId = encodeURIComponent(fullPath);
      const issueIid = issue.iid;
      const move_after_id = issueAfter ? formatIssueId(issueAfter.id) : null;
      const move_before_id = issueBefore ? formatIssueId(issueBefore.id) : null;

      if (issueBefore || issueAfter) {
        await fetch(`https://gitlab.com/api/v4/projects/${projectId}/issues/${issueIid}/reorder`, {
          method: "PUT",
          body: JSON.stringify({ move_after_id, move_before_id }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (labels) {
        // const milestone_id = milestoneBefore || milestoneAfter ? milestoneAfter?.id : undefined;
        // const labels =
        //   labelBefore || labelAfter
        //     ? [
        //         ...issue.labels.filter((l) => l.id !== labelBefore.id).map((l) => l.title),
        //         ...(labelAfter ? [labelAfter.title] : []),
        //       ]
        //     : undefined;
        await fetch(`https://gitlab.com/api/v4/projects/${projectId}/issues/${issueIid}`, {
          method: "PUT",
          body: JSON.stringify({
            milestone_id: milestoneId ? formatMilestoneId(milestoneId) : null,
            labels: labels?.map((l) => l.title) ?? undefined,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      return {
        fullPath,
        issue,
        issueAfter,
        issueBefore,
        labels,
        milestoneId,
      };
    },
    [token]
  );
}

export function useMutationReorderIssue() {
  const reorderIssue = useReorderIssue();
  const queryClient = useQueryClient();

  return useMutation(reorderIssue, {
    onMutate: ({ fullPath, issue, issueAfter, issueBefore, labels, milestoneId }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryClient.cancelQueries(["project", fullPath, "issues"]);

      // Snapshot the previous value
      const previousIssueList = queryClient.getQueryData(["project", fullPath, "issues"]);
      const newIssueList = [...previousIssueList];

      const index = newIssueList.findIndex((x) => x.id === issue.id);

      newIssueList[index] = {
        ...newIssueList[index],
        relativePosition: issueAfter
          ? issueAfter.relativePosition - 0.5
          : issueBefore
          ? issueBefore.relativePosition + 0.5
          : newIssueList[index].relativePosition,

        labels: labels ? labels : newIssueList[index].labels,

        milestone: milestoneId ? { id: milestoneId } : null, // newIssueList[index].milestone,

        isSaving: true,
      };

      // Optimistically update to the new value
      queryClient.setQueryData(["project", fullPath, "issues"], newIssueList);

      // Return a rollback function
      return () => queryClient.setQueryData(["project", fullPath, "issues"], previousIssueList);
    },

    onError: (err, data, rollback) => rollback(),

    onSettled: ({ fullPath }) => {
      queryClient.invalidateQueries(["project", fullPath, "issues"]);
    },
  });
}

export function useQueryGraphProjectLink(fullPath) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey }) => {
      const [key, x] = queryKey;

      const res = await graphQLClient.request(
        gql`
        query {
          project(fullPath: "${x}") {
            id
            fullPath
            avatarUrl
            name
          }
        }
      `
      );
      return res.project;
    },
    [graphQLClient]
  );

  return useQuery(["project-logo", fullPath], execute, { enabled: Boolean(graphQLClient) });
}

export function useQueryGraphProjectLatestTodo(id) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey }) => {
      const [key, x] = queryKey;

      function formatProjectId(id) {
        return Number(id.slice("gid://gitlab/Project/".length));
      }

      const res = await graphQLClient.request(
        gql`
          query {
            currentUser {
              todos(first: 1, state: pending, projectId: "${formatProjectId(x)}") {
                pageInfo {
                  hasNextPage
                }
                nodes {
                  createdAt
                  body
                  author {
                    name
                  }
                }
              }
            }
          }
        `
      );
      return res.currentUser?.todos;
    },
    [graphQLClient]
  );

  return useQuery(["project-latest-todo", id], execute, {
    enabled: Boolean(graphQLClient) && Boolean(id),
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: true,
  });
}

export function useQueryGraphProject(fullPath) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey }) => {
      const [key, x] = queryKey;

      const res = await graphQLClient.request(
        gql`
        query {
          project(fullPath: "${x}") {
            id
            name
            nameWithNamespace
            labels {
              nodes {
                id
                title
                color
                textColor
              }
            }
            group {
              labels {
                nodes {
                  id
                  title
                }
              }
            }
            milestones {
              nodes {
                id
                title
                startDate
                dueDate
                state
                description
              }
            }
          }
        }
      `
      );
      return res.project;
    },
    [graphQLClient]
  );

  return useQuery(["project", fullPath], execute, { enabled: Boolean(graphQLClient) });
}

export function useQueryGraphIssues(fullPath) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey }) => {
      const [key, fullPath] = queryKey;
      let results = [];

      async function loadPage(pageParam) {
        const res = await graphQLClient.request(
          gql`
          query {
            project(fullPath: "${fullPath}") {
              id
              name
              issues(after: "${pageParam}") {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                  iid
                  reference
                  title
                  relativePosition
                  state
                  assignees {
                    nodes {
                      avatarUrl
                    }
                  }
                  labels {
                    nodes {
                      title
                      id
                      color
                      textColor
                    } 
                  }
                  milestone {
                    id
                  }

                  currentUserTodos(state:pending) {
                    nodes {
                      id
                      createdAt
                    }
                  }
                }
              }
            }
          }
        `
        );
        return {
          issues: res.project.issues.nodes.map((x) => ({ ...x, labels: x.labels.nodes })),
          pageInfo: res.project.issues.pageInfo,
        };
      }

      let result = await loadPage(""); // initial page cursor is empty string
      results = [...results, ...result.issues];

      while (result.pageInfo.hasNextPage) {
        result = await loadPage(result.pageInfo.endCursor);
        results = [...results, ...result.issues];
      }

      return results;
    },
    [graphQLClient]
  );

  return useQuery(["project", fullPath, "issues"], execute);
}

export function useInfiniteQueryGraphProjects(search) {
  const graphQLClient = useGraphQLClient();

  const execute = React.useCallback(
    async ({ queryKey, pageParam = "" }) => {
      const [key, s] = queryKey;

      const res = await graphQLClient.request(
        gql`
          query SearchProjects($search: String) {
            projects(search: $search, membership: true, after: "${pageParam}") {
              nodes {
                id
                fullPath
                name
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        {
          search: s,
        }
      );
      return res.projects;
    },
    [graphQLClient]
  );

  return useInfiniteQuery(["projects", search], execute, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.pageInfo?.hasNextPage) {
        return lastPage.pageInfo.endCursor;
      }
      return undefined;
    },
  });
}

/*
query {
  project(fullPath: "gitlab-org/gitlab") {
    board(id: "gid://gitlab/Board/353448") {
      lists(id: "gid://gitlab/List/750477") {
        nodes {
          issues {
            nodes {
              id
              title
            }
          }
        }
      }
    }
  }
}


*/
