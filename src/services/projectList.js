import { useQuery } from "react-query";
import { useToken } from "./auth";

export function useGetMyProjects() {
  const token = useToken();

  return useQuery(["projectsList"], async () => {
    return fetch("https://gitlab.com/api/v4/projects?membership=true&per_page=100", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((r) => r.json());
  });
}
