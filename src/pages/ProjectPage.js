import React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import Layout from "../components/Layout";
import Board from "../components/Board";
import TitleCard from "../components/TitleCard";
import Ticket from "../components/Ticket";
import Dropzone from "../components/Dropzone";
import Avatar from "../components/Avatar";
import Logo from "../components/Logo";
import Loader from "../components/Loader";
import Drawer from "../components/Drawer";

import IssueDetailsContainer from "../containers/IssueDetailsContainer";
// import Mice from "../containers/Mice";

import {
  useMutationReorderIssue,
  useQueryGraphIssues,
  useQueryGraphProject,
} from "../services/project";

import { update, exit, useCollaborateState } from "../services/collaborate";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils";

function Column({ id, issues, onIssueClicked, selectedIssueId }) {
  return (
    <Droppable droppableId={id} type="column">
      {(dropProvided, dropSnapshot) => (
        <Dropzone ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          {issues?.map((t, i) => (
            <Draggable draggableId={`${t.iid}`} index={i} key={t.id}>
              {(dragProvided, dragSnapshot) => (
                <Ticket
                  id={t.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onIssueClicked(t.id);
                  }}
                  faded={t.state === "closed"}
                  selected={t.id === selectedIssueId}
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

  console.log({ graphIssues });

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
        name: `${milestone.title.padEnd(24)} (${milestone.startDate} - ${
          milestone.dueDate
        }) `.padEnd(56),
        id: milestone.id,
        state: milestone.state,
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

    return {
      project: project.data,
      rows,
      columns,
      cells,
      isFetching: graphIssues.isFetching || graphIssues.isLoading || !graphIssues.data,
    };
  }, [project.data, graphIssues]);
}

function isInViewport(elem, container) {
  const bounding = elem.getBoundingClientRect();

  const result =
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (container.clientHeight || document.documentElement.clientHeight) &&
    bounding.right <= (container.clientWidth || document.documentElement.clientWidth);

  console.log({ bounding, container, result });
  return result;
}

function ProjectPage() {
  const { projectPath } = useParams();
  const history = useHistory();
  const boardRef = React.useRef();
  const location = useLocation();
  const { project, rows, cells, columns, isFetching } = useBoard(projectPath);

  const [collapsedRows, setCollapsedRows] = React.useState(null);

  const reorder = useMutationReorderIssue();

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
      await reorder.mutateAsync({
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

  const selectedIssueId = queryString.parse(location.search).ticket || undefined;

  function scrollSelectedIssueIntoView() {
    if (collapsedRows && selectedIssueId) {
      const element = document.getElementById(selectedIssueId);

      // setTimeout(() => {
      if (element && boardRef.current && !isInViewport(element, boardRef.current)) {
        console.log("scrolling.");
        // element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        element.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
      }
      // }, 300);
    }
  }

  // React.useEffect(scrollSelectedIssueIntoView, [selectedIssueId, Boolean(collapsedRows)]);

  React.useLayoutEffect(() => {
    if (rows) {
      setCollapsedRows(rows.filter((r) => r.state === "closed").map((r) => r.id));
      // scrollSelectedIssueIntoView();
    }
  }, [Boolean(rows)]);

  function handleBoardClick() {
    history.replace({ search: "" });
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
        <Logo /> {project?.nameWithNamespace}
        {isFetching ? <Loader /> : null}
      </Layout.Topbar>
      <Layout.Content>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Board.Root ref={boardRef} onClick={handleBoardClick}>
            <Board.HeaderRow>
              {columns?.map(({ id, name, color }) => (
                <Board.ColumnHeader key={id || "none"}>
                  <TitleCard color={color}>{name}</TitleCard>
                </Board.ColumnHeader>
              ))}
            </Board.HeaderRow>
            {rows?.map((row) => (
              <React.Fragment key={row.id}>
                <Board.RowHeader
                  onClick={(event) => {
                    event.stopPropagation();

                    collapsedRows?.includes(row.id)
                      ? setCollapsedRows(collapsedRows.filter((x) => x != row.id))
                      : setCollapsedRows([...collapsedRows, row.id]);
                  }}
                >
                  <span style={{ opacity: row.state === "closed" ? 0.4 : 1, whiteSpace: "pre" }}>
                    {row.name}
                    {/* {row.cells.reduce((totals, cell) => totals c.length).length} issues */}
                    {row.state === "closed" ? "        Closed" : null}
                  </span>
                </Board.RowHeader>
                {!collapsedRows?.includes(row.id) && (
                  <Board.Row>
                    {row.cells.map((rowCell, i) => {
                      if (!rowCell.id) {
                        console.log(row, i);
                      }

                      return (
                        <Board.Cell key={rowCell.id}>
                          <Column
                            id={rowCell.id}
                            issues={cells[rowCell.id].issues}
                            selectedIssueId={selectedIssueId}
                            onIssueClicked={(id) => {
                              if (id === selectedIssueId) {
                                history.replace({ search: undefined });
                              } else {
                                history.replace({ search: queryString.stringify({ ticket: id }) });
                              }
                            }}
                          />
                        </Board.Cell>
                      );
                    })}
                  </Board.Row>
                )}
              </React.Fragment>
            ))}
            {/* <Mice projectPath={projectPath} /> */}
          </Board.Root>
        </DragDropContext>
        <Drawer show={Boolean(selectedIssueId)} onFrame={scrollSelectedIssueIntoView}>
          {selectedIssueId ? (
            <IssueDetailsContainer issueId={selectedIssueId} projectPath={projectPath} />
          ) : null}
        </Drawer>
      </Layout.Content>
    </Layout.Root>
  );
}

export default ProjectPage;
