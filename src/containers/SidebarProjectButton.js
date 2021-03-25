import React from "react";
import SidebarButton from "../components/SidebarButton";
import { useQueryGraphProjectLatestTodo, useQueryGraphProjectLink } from "../services/project";
import { useLastTodoDate, useSetLastTodoDate } from "../services/storage";
import { DateTime } from "luxon";
import { usePlayNotification } from "../services/notification";

function SidebarProjectButton({ fullPath }) {
  const projectQuery = useQueryGraphProjectLink(fullPath);
  const todosQuery = useQueryGraphProjectLatestTodo(projectQuery.data?.id);

  const lastTodoDate = useLastTodoDate(fullPath);
  const setLastTodoDate = useSetLastTodoDate();
  const play = usePlayNotification();

  const hasTodo = Array.isArray(todosQuery.data?.nodes) && todosQuery.data?.nodes.length > 0;

  React.useEffect(() => {
    // calculate the current todo date:
    const newTodoDate = todosQuery.data?.nodes?.[0]?.createdAt;

    const newTodoDateTime = DateTime.fromISO(newTodoDate);
    const lastTodoDateTime = DateTime.fromISO(lastTodoDate);

    if (newTodoDate && newTodoDate !== lastTodoDate) {
      if (newTodoDateTime > lastTodoDateTime || !Boolean(lastTodoDate)) {
        play();
        setLastTodoDate(fullPath, newTodoDate);
      }
    }
  }, [todosQuery.dataUpdatedAt, lastTodoDate]);

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
