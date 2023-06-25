import React from "react";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "react-dom";

render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
