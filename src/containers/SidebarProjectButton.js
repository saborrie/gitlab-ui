import React from "react";
import SidebarButton from "../components/SidebarButton";
import { useQueryGraphProjectLatestTodo, useQueryGraphProjectLink } from "../services/project";

function SidebarProjectButton({ fullPath }) {
  const projectQuery = useQueryGraphProjectLink(fullPath);

  const todosQuery = useQueryGraphProjectLatestTodo(projectQuery.data?.id);

  const hasTodo = Array.isArray(todosQuery.data?.nodes) && todosQuery.data?.nodes.length > 0;
  console.log(todosQuery.data?.nodes, Array.isArray(todosQuery.data?.nodes));

  const sidebarButtonProps = {
    to: `/project/${fullPath}`,
    badge: hasTodo,
    title: projectQuery.data?.id,
  };

  if (!projectQuery.data) {
    return <SidebarButton {...sidebarButtonProps}></SidebarButton>;
  }

  if (projectQuery.data?.avatarUrl) {
    return <SidebarButton url={projectQuery.data?.avatarUrl} {...sidebarButtonProps} />;
  }

  const name = projectQuery.data?.name ?? "";

  const initials = name
    .toUpperCase()
    .split(" ")
    .slice(0, 3)
    .map((x) => x[0])
    .join("");

  return <SidebarButton {...sidebarButtonProps}>{initials}</SidebarButton>;
}

export default SidebarProjectButton;
