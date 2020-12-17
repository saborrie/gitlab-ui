import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Board from "../components/Board";
import TitleCard from "../components/TitleCard";
import Ticket from "../components/Ticket";
import Dropzone from "../components/Dropzone";
import Avatar from "../components/Avatar";

// import Mice from "../containers/Mice";

import {
  useMutationReorderIssue,
  useQueryGraphIssues,
  useQueryGraphProject,
} from "../services/project";

import { update, exit, useCollaborateState } from "../services/collaborate";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils";

function Column({ id, issues }) {
  return (
    <Droppable droppableId={id} type="column">
      {(dropProvided, dropSnapshot) => (
        <Dropzone ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          {issues?.map((t, i) => (
            <Draggable draggableId={`${t.iid}`} index={i} key={t.id}>
              {(dragProvided, dragSnapshot) => (
                <Ticket
                  faded={t.state === "closed"}
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                >
                  {/* {t.reference} {t.isSaving && <span style={{ color: "red" }}>saving...</span>} */}

                  <Ticket.Content>
                    {t.title}
                    <br />
                    <br />
                    <small>
                      {t.labels?.map((x) => (
                        <span
                          style={{
                            padding: 2,
                            marginRight: 4,
                            borderRadius: 2,
                            background: x.color,
                            color: pickTextColorBasedOnBgColorAdvanced(x.color, "#f0f0f0", "black"),
                          }}
                        >
                          {x.title}
                        </span>
                      ))}
                    </small>
                  </Ticket.Content>
                  <Ticket.Spacer />
                  <Ticket.Info>
                    {t.reference} {t.isSaving && <span>saving...</span>}
                    <Ticket.Spacer />
                    {t.assignees?.nodes?.map((n) => (
                      <Avatar url={`https://gitlab.com${n.avatarUrl}`} />
                    ))}
                  </Ticket.Info>
                </Ticket>
              )}
            </Draggable>
          ))}
          {dropProvided.placeholder}
        </Dropzone>
      )}
    </Droppable>
  );
}

function useBoard(projectPath) {
  const project = useQueryGraphProject(projectPath);
  const graphIssues = useQueryGraphIssues(projectPath);

  return React.useMemo(() => {
    if (!project.data || !graphIssues.data) {
      return {};
    }

    const labels = project.data?.labels.nodes;
    const milestones = project.data?.milestones.nodes;

    const columns = [
      { name: "No label" },
      ...labels?.map((label) => ({ name: label.title, id: label.id, color: label.color, label })),
    ];

    const rows = [
      ...milestones?.map((milestone) => ({
        name: milestone.title,
        id: milestone.id,
        milestone,
        cells: columns.map((c) => ({ id: milestone.id + c.id, label: c.label, milestone })),
      })),
      {
        id: "x",
        name: "No milestone",
        cells: columns.map((c) => ({ id: "x" + c.id, label: c.label })),
      },
    ];

    const cells = {};

    rows.forEach((row) =>
      row.cells.forEach(
        ({ id, milestone, label }) =>
          (cells[id] = {
            id,
            milestone,
            label,
            issues: graphIssues?.data
              ?.sort((a, b) => a.relativePosition - b.relativePosition)
              ?.filter((i) => {
                const matchesMilestone = i.milestone?.id === milestone?.id;
                const matchesLabel = label
                  ? i.labels.findIndex((l) => l.title === label?.title) !== -1
                  : !Boolean(i.labels?.length);

                return matchesMilestone && matchesLabel;
              }),
          })
      )
    );

    return { project: project.data, rows, columns, cells };
  }, [project.data, graphIssues]);
}

function ProjectPage() {
  const { projectPath } = useParams();
  const { project, rows, cells, columns } = useBoard(projectPath);

  const [reorder] = useMutationReorderIssue();

  async function handleDragEnd(result) {
    if (!result.destination) {
      alert("failed.");
      return;
    }

    const issue = cells[result.source?.droppableId].issues[result.source.index];
    let offset = 0;

    if (
      result.source?.droppableId === result.destination?.droppableId &&
      result.source.index < result.destination.index
    ) {
      offset = 1;
    }

    const cellBefore = cells[result.source?.droppableId];
    const cellAfter = cells[result.destination?.droppableId];

    const issueBefore = cellBefore.issues[result.destination.index - 1 + offset];
    const issueAfter = cellAfter.issues[result.destination.index + offset];

    const labelBefore = cellBefore.label;
    const labelAfter = cellAfter.label;

    const milestoneBefore = cellBefore.milestone;
    const milestoneAfter = cellAfter.milestone;

    const milestoneId = milestoneBefore || milestoneAfter ? milestoneAfter?.id : undefined;
    const labels =
      labelBefore || labelAfter
        ? [
            ...issue.labels.filter((l) => l.id !== labelBefore.id),
            ...(labelAfter ? [labelAfter] : []),
          ]
        : undefined;

    try {
      await reorder({
        fullPath: projectPath,
        issue,
        issueAfter,
        issueBefore,
        milestoneId,
        labels,
      });
    } catch {
      alert("Failed to move the issue");
      // Uh oh, something went wrong
    }
  }

  // return (
  //   <>
  //     <pre>{JSON.stringify(collaborateState, null, 4)}</pre>

  //     {Object.keys(collaborateState)
  //       .filter(
  //         (key) =>
  //           Number.isFinite(collaborateState[key].x) && Number.isFinite(collaborateState[key].y)
  //       )
  //       .map((key) => (
  //         <div
  //           style={{
  //             position: "absolute",
  //             top: collaborateState[key].y,
  //             left: collaborateState[key].x,
  //             width: 10,
  //             height: 10,
  //             background: "red",
  //           }}
  //         ></div>
  //       ))}
  //   </>
  // );

  return (
    <Layout.Root>
      <Layout.Topbar>
        <svg
          width="24"
          height="24"
          class="tanuki-logo"
          viewBox="0 0 36 36"
          style={{ marginRight: 16 }}
        >
          <path
            class="tanuki-shape tanuki-left-ear"
            fill="#e24329"
            d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"
          ></path>
          <path
            class="tanuki-shape tanuki-right-ear"
            fill="#e24329"
            d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"
          ></path>
          <path class="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z"></path>
          <path
            class="tanuki-shape tanuki-left-eye"
            fill="#fc6d26"
            d="M18,34.38 11.38,14 2,14 6,25Z"
          ></path>
          <path
            class="tanuki-shape tanuki-right-eye"
            fill="#fc6d26"
            d="M18,34.38 24.62,14 34,14 30,25Z"
          ></path>
          <path
            class="tanuki-shape tanuki-left-cheek"
            fill="#fca326"
            d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"
          ></path>
          <path
            class="tanuki-shape tanuki-right-cheek"
            fill="#fca326"
            d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"
          ></path>
        </svg>{" "}
        {project?.nameWithNamespace}
      </Layout.Topbar>
      <Layout.Content>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Board.Root>
            <Board.HeaderRow>
              {columns?.map(({ id, name, color }) => (
                <Board.ColumnHeader key={id || "none"}>
                  <TitleCard color={color}>{name}</TitleCard>
                </Board.ColumnHeader>
              ))}
            </Board.HeaderRow>
            {rows?.map((row) => (
              <React.Fragment key={row.id}>
                <Board.RowHeader>{row.name}</Board.RowHeader>
                <Board.Row>
                  {row.cells.map((rowCell, i) => {
                    if (!rowCell.id) {
                      console.log(row, i);
                    }

                    return (
                      <Board.Cell key={rowCell.id}>
                        <Column id={rowCell.id} issues={cells[rowCell.id].issues} />
                      </Board.Cell>
                    );
                  })}
                </Board.Row>
              </React.Fragment>
            ))}
            {/* <Mice projectPath={projectPath} /> */}
          </Board.Root>
        </DragDropContext>
      </Layout.Content>
    </Layout.Root>
  );
}

export default ProjectPage;
