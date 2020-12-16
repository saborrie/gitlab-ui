import React from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import LoginContainer from "./containers/LoginContainer";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import { useLoggedIn } from "./services/auth";

function App() {
  const loggedIn = useLoggedIn();

  if (!loggedIn) {
    return <LoginContainer />;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/project/:projectPath+">
          <ProjectPage />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
