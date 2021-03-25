import React from "react";
import { useToken } from "./auth";
import { useQuery } from "react-query";

export default function useGetProjectFile(projectId, filePath) {
  const token = useToken();

  return useQuery(
    ["project", projectId, "file", filePath],
    async () => {
      const result = await fetch(
        `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${filePath}/raw?ref=master`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return await result.text();
    },
    {
      enabled: Boolean(projectId),
    }
  );
}
