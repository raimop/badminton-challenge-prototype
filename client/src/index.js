import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import moment from "moment";
import 'moment/locale/et'
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { ConfigProvider } from 'antd';
import et_EE from 'antd/lib/locale/et_EE';
import "./index.css";
moment.locale("et")

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={et_EE}>
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
