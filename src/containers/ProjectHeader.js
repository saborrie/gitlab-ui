import React from "react";
import Layout from "../components/Layout";
import { useGetProjectMeta } from "../services/project";

function ProjectHeader({ projectId }) {
  const projectMeta = useGetProjectMeta(projectId);

  if (projectMeta.isLoading) {
    return <Layout.Topbar>loading...</Layout.Topbar>;
  }

  if (projectMeta.error) {
    return <Layout.Topbar>There was an error.</Layout.Topbar>;
  }

  return <Layout.Topbar>{projectMeta.data?.name_with_namespace}</Layout.Topbar>;
}

export default ProjectHeader;
