import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OAuthConfig } from "./configurations/configuration.js";
import { ConfigProvider } from "antd";
import moment from "moment";

ConfigProvider.config({
  datePicker: {
    dateLibrary: moment,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={OAuthConfig.clientId}>
      <BrowserRouter>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);
