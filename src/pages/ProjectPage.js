import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Board from "../components/Board";
import TitleCard from "../components/TitleCard";
import Ticket from "../components/Ticket";
import Dropzone from "../components/Dropzone";

import Mice from "../containers/Mice";

import {
  useMutationReorderIssue,
  useQueryGraphIssues,
  useQueryGraphProject,
} from "../services/project";

import { update, exit, useCollaborateState } from "../services/collaborate";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Column({ id, issues }) {
  return (
    <Droppable droppableId={id} type="column">
      {(dropProvided, dropSnapshot) => (
        <Dropzone ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          {issues?.map((t, i) => (
            <Draggable draggableId={`${t.iid}`} index={i} key={t.id}>
              {(dragProvided, dragSnapshot) => (
                <Ticket
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                >
                  {/* {t.reference} {t.isSaving && <span style={{ color: "red" }}>saving...</span>} */}

                  <Ticket.Content>
                    {t.title}
                    <small>{t.labels?.map((x) => x.title).join(", ")}</small>
                  </Ticket.Content>
                  <Ticket.Spacer />
                  <Ticket.Number>
                    {t.reference} {t.isSaving && <span>saving...</span>}
                  </Ticket.Number>
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
      ...labels?.map((label) => ({ name: label.title, id: label.id, label })),
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
      <Layout.Topbar>{project?.nameWithNamespace}</Layout.Topbar>
      <Layout.Content>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Board.Root>
            <Board.HeaderRow>
              {columns?.map(({ id, name }) => (
                <Board.ColumnHeader key={id || "none"}>
                  <TitleCard>{name}</TitleCard>
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
