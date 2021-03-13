import React from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import LoginContainer from "./containers/LoginContainer";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import { useLoggedIn } from "./services/auth";
import Layout from "./components/Layout";
import Logo from "./components/Logo";
import SidebarButton from "./components/SidebarButton";
import { Provider, useSavedProjects } from "./services/storage";
import Sidebar from "./containers/Sidebar";

const queryClient = new QueryClient();

function App() {
  const loggedIn = useLoggedIn();

  if (!loggedIn) {
    return <LoginContainer />;
  }

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <Layout.App>
          <BrowserRouter>
            <Sidebar />
            <Switch>
              <Route path="/project/:projectPath+">
                <ProjectPage />
              </Route>
              <Route exact path="/add">
                <HomePage />
              </Route>
              <Route>
                <RedirectHandler />
              </Route>
            </Switch>
          </BrowserRouter>
        </Layout.App>
      </QueryClientProvider>
    </Provider>
  );
}

function RedirectHandler() {
  const savedProjects = useSavedProjects();

  if (savedProjects.length > 0) {
    return <Redirect from="*" to={`/project/${savedProjects[0]}`} />;
  } else {
    return <Redirect from="*" to="/add" />;
  }
}

export default App;
