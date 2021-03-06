import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import stripHtmlComments from "strip-html-comments";
import {
  useMutationCreateNote,
  useMutationUpdateIssueState,
  useQueryIssue,
} from "../services/issue";
import Timeago from "react-timeago";

import Loader from "../components/Loader";
import Bubble from "../components/Bubble";
import BubbleHolder from "../components/BubbleHolder";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils";
import Scrollbars from "react-custom-scrollbars";
import Avatar from "../components/Avatar";
import Divider from "../components/Divider";
import BubbleFooter from "../components/BubbleFooter";
import InfoBubble from "../components/InfoBubble";
import SystemIcons from "../components/SystemIcons";
import InvisibleInput from "../components/InvisibleInput";
import CreateNote from "./CreateNote";
import DrawerSection from "../components/DrawerSection";
import IssueStateButton from "./IssueStateButton";
import useLoadSettings from "../services/useLoadSettings";
import IssueLabelButton from "./IssueLabelButton";
import EditIssueProvider from "./EditIssueProvider";
import IssueTitleEditor from "./IssueTitleEditor";
import EditIssueSaveDialog from "./EditIssueSaveDialog";

function IssueDetailsContainer({ issueId, projectPath, projectId }) {
  const issueQuery = useQueryIssue(issueId, { enabled: Boolean(issueId) });

  const settings = useLoadSettings(projectId);

  if (issueQuery.isLoading) return <Loader />;

  return (
    <EditIssueProvider
      projectPath={projectPath}
      issue={issueQuery.data}
      title={issueQuery.data?.title}
      description={issueQuery.data?.description}
    >
      <Scrollbars>
        <DrawerSection flex>
          {/* <PillButton>
          <Loader />
        </PillButton> */}
          {issueQuery.data && <IssueStateButton issueId={issueId} projectPath={projectPath} />}

          <DrawerSection.Spacer grow />

          {issueQuery.data &&
            issueQuery.data.assignees?.nodes?.map((n) => (
              <>
                {n.name}
                <DrawerSection.Spacer />

                <Avatar size={32} url={`https://gitlab.com${n.avatarUrl}`} />
              </>
            ))}
        </DrawerSection>
        <DrawerSection>
          <IssueTitleEditor />

          <small>
            <a
              href={`https://gitlab.com/${projectPath}/-/issues/${issueQuery.data?.iid}`}
              target="_blank"
            >
              {issueQuery.data?.reference}
            </a>
          </small>
          <br />
          <br />
          <div>
            <h2>Labels</h2>
            {issueQuery.data?.labels.nodes
              ?.filter(
                (x) => !settings?.workflows?.some((w) => w.labels.some((l) => x.title === l))
              )
              ?.map((x) => (
                <span
                  style={{
                    padding: "4px 8px",
                    marginRight: 4,
                    borderRadius: 2,
                    background: x.color,
                    color: pickTextColorBasedOnBgColorAdvanced(x.color, "#f0f0f0", "black"),
                  }}
                >
                  {x.title}
                </span>
              ))}
          </div>
          {!settings && <Loader />}
          {settings?.workflows?.map((workflow) => (
            <div>
              <h2>{workflow.name}</h2>
              {workflow?.labels?.map((workflowLabel) => {
                return (
                  <span style={{ marginRight: 4 }}>
                    <IssueLabelButton
                      issueId={issueId}
                      projectPath={projectPath}
                      label={workflowLabel}
                      shouldRemoveLabel={(l) =>
                        l.title !== workflowLabel && workflow.labels.includes(l.title)
                      }
                    />
                  </span>
                );
              })}
            </div>
          ))}
          <ReactMarkdown
            plugins={[gfm]}
            transformImageUri={(i) => `https://gitlab.com/${projectPath}${i}`}
          >
            {stripHtmlComments(issueQuery.data?.description ?? "")}
          </ReactMarkdown>
          <br />
          <br />

          <Divider />
          <br />

          {issueQuery.data?.discussions.nodes.map((discussion) => (
            <div>
              {discussion.notes.nodes.map((note, index) => {
                const hasMatchingTodo =
                  issueQuery.data?.currentUserTodos.nodes.filter((x) => x.body === note.body)
                    .length > 0;

                if (note.system) {
                  return (
                    <BubbleHolder
                      spaced
                      depth={0}
                      avatarSize={24}
                      left={
                        <Avatar url={`/system-note-icons.svg#clock`} size={24}>
                          <SystemIcons name={note.systemNoteIconName} />
                        </Avatar>
                      }
                    >
                      <InfoBubble>
                        {note.author.name} {note.body}
                      </InfoBubble>
                      <BubbleFooter>
                        <Timeago date={note.createdAt} />
                      </BubbleFooter>
                    </BubbleHolder>
                  );
                }

                return (
                  <BubbleHolder
                    avatarSize={index === 0 ? 32 : 24}
                    depth={index === 0 ? 0 : 1}
                    left={
                      <Avatar
                        size={index === 0 ? 32 : 24}
                        url={`https://gitlab.com${note.author.avatarUrl}`}
                      />
                    }
                  >
                    <Bubble highlighted={hasMatchingTodo}>
                      <div>{note.author.name}</div>
                      <ReactMarkdown
                        plugins={[gfm]}
                        transformImageUri={(i) => `https://gitlab.com/${projectPath}${i}`}
                      >
                        {stripHtmlComments(note.body ?? "")}
                      </ReactMarkdown>
                    </Bubble>
                    <BubbleFooter>
                      <Timeago date={note.createdAt} />
                    </BubbleFooter>
                  </BubbleHolder>
                );
              })}

              {!Boolean(discussion.notes.nodes[0]?.system) && (
                <BubbleHolder
                  avatarSize={24}
                  depth={1}
                  fullWidth
                  left={
                    <Avatar
                      size={24}
                      // url={`https://gitlab.com${note.author.avatarUrl}`}
                    />
                  }
                >
                  <Bubble>
                    <CreateNote issueId={issueId} discussionId={discussion.id} />
                  </Bubble>
                </BubbleHolder>
              )}
            </div>
          ))}

          <br />

          <Divider />
          <br />

          <BubbleHolder
            avatarSize={32}
            depth={0}
            fullWidth
            left={
              <Avatar
                size={32}
                // url={`https://gitlab.com${note.author.avatarUrl}`}
              />
            }
          >
            <Bubble>
              <CreateNote issueId={issueId} />
            </Bubble>
          </BubbleHolder>
        </DrawerSection>
      </Scrollbars>
      <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)" }}>
        <EditIssueSaveDialog />
      </div>
    </EditIssueProvider>
  );
}

export default IssueDetailsContainer;
