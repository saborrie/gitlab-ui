import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useQueryIssue } from "../services/issue";

import Loader from "../components/Loader";
import { pickTextColorBasedOnBgColorAdvanced } from "../utils";
import Scrollbars from "react-custom-scrollbars";

function IssueDetailsContainer({ issueId }) {
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
        <p>
          <ReactMarkdown plugins={[gfm]}>{issueQuery.data?.description}</ReactMarkdown>
        </p>

        {issueQuery.data?.discussions.nodes.map((discussion) => (
          <div>
            {discussion.notes.nodes.map((note) => (
              <div style={{ paddingTop: 20 }}>
                {note.author.name}:<div style={{ paddingTop: 4, paddingLeft: 16 }}>{note.body}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Scrollbars>
  );
}

export default IssueDetailsContainer;
