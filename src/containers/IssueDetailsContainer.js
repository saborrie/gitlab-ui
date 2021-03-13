import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useMutationCreateNote, useQueryIssue } from "../services/issue";
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

function IssueDetailsContainer({ issueId, projectPath }) {
  const issueQuery = useQueryIssue(issueId, { enabled: Boolean(issueId) });

  if (issueQuery.isLoading) return <Loader />;

  return (
    <Scrollbars>
      <div style={{ paddingLeft: 24, paddingTop: 10, paddingRight: 10, paddingBottom: 24 }}>
        <h1>{issueQuery.data?.title}</h1>
        <small>{issueQuery.data?.reference}</small>
        <br />
        <br />
        {issueQuery.data?.labels.nodes?.map((x) => (
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
        <ReactMarkdown
          plugins={[gfm]}
          transformImageUri={(i) => `https://gitlab.com/${projectPath}${i}`}
        >
          {issueQuery.data?.description}
        </ReactMarkdown>
        <br />
        <br />

        <Divider />
        <br />

        {issueQuery.data?.discussions.nodes.map((discussion) => (
          <div>
            {discussion.notes.nodes.map((note, index) => {
              const hasMatchingTodo =
                issueQuery.data?.currentUserTodos.nodes.filter((x) => x.body === note.body).length >
                0;

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
                      {note.body}
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
      </div>
    </Scrollbars>
  );
}

export default IssueDetailsContainer;
