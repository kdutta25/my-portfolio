import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import "./index.css";
import "./theme.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./context/ThemeContext";
import I18nSync from "./components/I18nSync";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nSync />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
