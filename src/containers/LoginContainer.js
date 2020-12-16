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
    </div>
  );
}

export default LoginContainer;
