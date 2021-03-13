import React from "react";
import { useSignIn } from "../services/auth";

function LoginContainer() {
  const [token, setToken] = React.useState("");
  const signIn = useSignIn();

  function handleSubmit() {
    signIn(token);
  }

  return (
    <div>
      <h1>Please enter your GitLab token</h1>
      <input value={token} onChange={(e) => setToken(e.target.value)} />

      <button onClick={handleSubmit}>Submit</button>

      <h2>How to create a token:</h2>
      <ol>
        <li>
          Open{" "}
          <a style={{ color: "white" }} href="https://gitlab.com/-/profile/personal_access_tokens">
            your access tokens page
          </a>
          , or:
          <ul>
            <li>Click your user in the top right corner of GitLab</li>
            <li>Select "settings" in the dropdown</li>
            <li>Select "Access Tokens" on the sidebar</li>
          </ul>
        </li>
        <li>Write a name for your new token and select the "api" scope</li>
        <li>Choose an expiry for your token and create it</li>
      </ol>
    </div>
  );
}

export default LoginContainer;
