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

import { usePlayNotification } from "../services/notification";

import NewIssueContainer from "../containers/NewIssueContainer";
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
import FloatingFooter from "../components/FloadingFooter";
import FloatingFooterPill from "../components/FloatingFooterPill";
import AddButton from "../components/AddButton";
import NewTicketButton from "../components/NewTicketButton";
import SystemIcons from "../components/SystemIcons";
import useLoadSettings from "../services/useLoadSettings";
import PillButton from "../components/PillButton";

function Column({
  id,
  issues,
  onIssueClicked,
  selectedIssueId,
  newTicketButton,
  filterLabels,
  isListMode,
  label,
}) {
  return (
    <Droppable droppableId={id} type="column">
      {(dropProvided, dropSnapshot) => (
        <Dropzone ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
          {issues?.map((t, i) => (
            <Draggable draggableId={`${t.iid}`} index={i} key={t.id}>
              {(dragProvided, dragSnapshot) => {
                const content = isListMode ? (
                  <>
                    <Ticket.Info>
                      <span style={{ width: 80, fontSize: 16 }}>{t.reference}</span>
                      <span style={{ fontSize: 16 }}>{t.title}</span>
                      <Ticket.Spacer />

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

                      <span style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>
                        {t.assignees?.nodes?.map((n) => (
                          <Avatar url={`https://gitlab.com${n.avatarUrl}`} />
                        ))}
                      </span>
                    </Ticket.Info>
                  </>
                ) : (
                  <>
                    <Ticket.Content>
                      {t.title}
                      <br />
                      <br />
                      <small>
                        {t.labels
                          ?.filter((x) => !Boolean(label) || x.id !== label?.id)
                          ?.map((x) => (
                            <span
                              style={{
                                padding: 2,
                                marginRight: 4,
                                borderRadius: 2,
                                background: x.color,
                                color: pickTextColorBasedOnBgColorAdvanced(
                                  x.color,
                                  "#f0f0f0",
                                  "black"
                                ),
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
                  </>
                );

                return (
                  <Ticket
                    isListMode={isListMode}
                    id={t.id}
                    badge={t.currentUserTodos?.nodes?.length > 0}
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
                    {content}
                  </Ticket>
                );
              }}
            </Draggable>
          ))}
          {dropProvided.placeholder}
          {newTicketButton}
        </Dropzone>
      )}
    </Droppable>
  );
}

function useBoard(projectPath, { isListMode }) {
  const project = useQueryGraphProject(projectPath);
  const graphIssues = useQueryGraphIssues(projectPath);
  const settings = useLoadSettings(project.data?.id);

  return React.useMemo(() => {
    if (!project.data || !graphIssues.data || settings === null) {
      return {};
    }

    const labels = isListMode
      ? []
      : project.data?.labels.nodes
          .filter((node) => {
            if (settings.labels) {
              return settings.labels.includes(node.title);
            }

            return true;
          })
          .sort((a, b) => {
            if (settings.labels) {
              return settings.labels.indexOf(a.title) - settings.labels.indexOf(b.title);
            }

            return 0;
          });

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
            issues: [...graphIssues?.data]
              ?.sort((a, b) => a.relativePosition - b.relativePosition)
              ?.filter((i) => {
                const matchesMilestone = i.milestone?.id === milestone?.id;
                const matchesLabel = label
                  ? i.labels.findIndex((l) => l.title === label?.title) !== -1
                  : !Boolean(i.labels?.length) ||
                    labels.findIndex(
                      (l) => i.labels.findIndex((il) => il.title === l.title) === -1
                    ) === -1;

                return matchesMilestone && matchesLabel;
              }),
          })
      )
    );

    const todoIssues = graphIssues?.data.filter((i) => i.currentUserTodos?.nodes?.length > 0);

    return {
      project: project.data,
      rows,
      columns,
      cells,
      todoIssues,
      isFetching: graphIssues.isFetching || graphIssues.isLoading || !graphIssues.data,
    };
  }, [project.data, graphIssues, settings]);
}

function isInViewport(elem, container) {
  const bounding = elem.getBoundingClientRect();

  const result =
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (container.clientHeight || document.documentElement.clientHeight) &&
    bounding.right <= (container.clientWidth || document.documentElement.clientWidth);

  return result;
}

function ProjectPage() {
  const { projectPath } = useParams();
  const history = useHistory();
  const boardRef = React.useRef();
  const location = useLocation();

  const [showClosedMileStones, setShowClosedMileStones] = React.useState(true);
  const [showClosedIssues, setShowClosedIssues] = React.useState(true);
  const [isListMode, setIsListMode] = React.useState(false);

  const { project, rows, cells, columns, isFetching, todoIssues } = useBoard(projectPath, {
    isListMode,
  });

  const [collapsedRows, setCollapsedRows] = React.useState(null);

  const reorder = useMutationReorderIssue();

  const filterIssues = (t) => showClosedIssues || t.state !== "closed";

  async function handleDragEnd(result) {
    if (!result.destination) {
      alert("failed.");
      return;
    }

    const issue =
      cells[result.source?.droppableId].issues.filter(filterIssues)[result.source.index];
    let offset = 0;

    if (
      result.source?.droppableId === result.destination?.droppableId &&
      result.source.index < result.destination.index
    ) {
      offset = 1;
    }

    const cellBefore = cells[result.source?.droppableId];
    const cellAfter = cells[result.destination?.droppableId];

    const issueBefore =
      cellBefore.issues.filter(filterIssues)[result.destination.index - 1 + offset];
    const issueAfter = cellAfter.issues.filter(filterIssues)[result.destination.index + offset];

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
  const selectedLabelId = queryString.parse(location.search).label || undefined;
  const selectedMilestoneId = queryString.parse(location.search).milestone || undefined;

  function scrollSelectedIssueIntoView() {
    if (collapsedRows && selectedIssueId) {
      const element = document.getElementById(selectedIssueId);

      // setTimeout(() => {
      if (element && boardRef.current && !isInViewport(element, boardRef.current)) {
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
        {project?.nameWithNamespace}
        {isFetching ? <Loader /> : null}
        <Layout.TopbarSpacer grow />
        <PillButton
          onClick={() => setShowClosedMileStones(!showClosedMileStones)}
          color={!showClosedMileStones ? "#ffffff" : undefined}
        >
          {showClosedMileStones ? "Showing" : "Hiding"} closed milestones
        </PillButton>
        <Layout.TopbarSpacer />
        <PillButton
          onClick={() => setShowClosedIssues(!showClosedIssues)}
          color={!showClosedIssues ? "#ffffff" : undefined}
        >
          {showClosedIssues ? "Showing" : "Hiding"} closed issues
        </PillButton>
        <Layout.TopbarSpacer />
        <PillButton
          onClick={() => setIsListMode(!isListMode)}
          color={isListMode ? "#ffffff" : undefined}
        >
          {isListMode ? "List mode" : "Map mode"}
        </PillButton>
      </Layout.Topbar>
      <Layout.Content>
        <Layout.ContentArea>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Board.Root ref={boardRef} onClick={handleBoardClick}>
              <Board.HeaderRow>
                {isListMode ? (
                  <Board.ColumnHeader />
                ) : (
                  columns?.map(({ id, name, color }) => (
                    <Board.ColumnHeader key={id || "none"}>
                      <TitleCard color={color}>{name}</TitleCard>
                    </Board.ColumnHeader>
                  ))
                )}
              </Board.HeaderRow>
              {rows
                ?.filter((row) => showClosedMileStones || row.state !== "closed")
                ?.map((row) => (
                  <React.Fragment key={row.id}>
                    <Board.RowHeader
                      onClick={(event) => {
                        event.stopPropagation();

                        collapsedRows?.includes(row.id)
                          ? setCollapsedRows(collapsedRows.filter((x) => x != row.id))
                          : setCollapsedRows([...collapsedRows, row.id]);
                      }}
                    >
                      <span
                        style={{ opacity: row.state === "closed" ? 0.4 : 1, whiteSpace: "pre" }}
                      >
                        {row.name}
                        {/* {row.cells.reduce((totals, cell) => totals c.length).length} issues */}
                        {row.state === "closed" ? "        Closed" : null}
                      </span>
                    </Board.RowHeader>
                    {!collapsedRows?.includes(row.id) && (
                      <Board.Row>
                        {row.cells.map((rowCell, i) => {
                          const Cell = isListMode ? Board.ListCell : Board.Cell;

                          return (
                            <Cell key={rowCell.id} isListMode={isListMode}>
                              <Column
                                label={rowCell.label}
                                isListMode={isListMode}
                                id={rowCell.id}
                                issues={cells[rowCell.id].issues.filter(
                                  (t) => showClosedIssues || t.state !== "closed"
                                )}
                                selectedIssueId={selectedIssueId}
                                onIssueClicked={(id) => {
                                  if (id === selectedIssueId) {
                                    history.replace({ search: undefined });
                                  } else {
                                    history.replace({
                                      search: queryString.stringify({ ticket: id }),
                                    });
                                  }
                                }}
                                newTicketButton={
                                  <NewTicketButton
                                    isListMode={isListMode}
                                    onClick={(event) => {
                                      event.stopPropagation();

                                      const label = rowCell.label?.id || undefined;
                                      const milestone = rowCell.milestone?.id || undefined;

                                      if (
                                        "new" === selectedIssueId &&
                                        label === selectedLabelId &&
                                        milestone === selectedMilestoneId
                                      ) {
                                        history.replace({ search: undefined });
                                      } else {
                                        history.replace({
                                          search: queryString.stringify({
                                            ticket: "new",
                                            label,
                                            milestone,
                                          }),
                                        });
                                      }
                                    }}
                                  >
                                    <SystemIcons color="#2c2e35" name="plus" />
                                  </NewTicketButton>
                                }
                              />
                            </Cell>
                          );
                        })}
                      </Board.Row>
                    )}
                  </React.Fragment>
                ))}
              {/* <Mice projectPath={projectPath} /> */}
            </Board.Root>
          </DragDropContext>
          {todoIssues?.length > 0 && (
            <FloatingFooter>
              {todoIssues?.map((t) => (
                <FloatingFooterPill
                  selected={t.id === selectedIssueId}
                  onClick={() => {
                    history.replace({
                      search: queryString.stringify({ ticket: t.id }),
                    });
                  }}
                >
                  #{t.iid}
                </FloatingFooterPill>
              ))}
            </FloatingFooter>
          )}
        </Layout.ContentArea>
        <Drawer show={isListMode || Boolean(selectedIssueId)} onFrame={scrollSelectedIssueIntoView}>
          {selectedIssueId ? (
            selectedIssueId === "new" ? (
              <NewIssueContainer
                milestoneId={selectedMilestoneId}
                labelId={selectedLabelId}
                projectPath={projectPath}
                goToIssue={(issueId) => {
                  history.replace({
                    search: queryString.stringify({ ticket: issueId }),
                  });
                }}
              />
            ) : (
              <IssueDetailsContainer
                issueId={selectedIssueId}
                projectPath={projectPath}
                projectId={project?.id}
              />
            )
          ) : null}
        </Drawer>
      </Layout.Content>
    </Layout.Root>
  );
}

export default ProjectPage;
