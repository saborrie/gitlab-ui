import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import jss from "jss";
import nested from "jss-plugin-nested";

import { LoginProvider } from "./services/auth";

// import { started } from "./services/collaborate";

jss.use(nested);

async function run() {
  // await started;

  ReactDOM.render(
    <React.StrictMode>
      <LoginProvider>
        <App />
      </LoginProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

run();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
