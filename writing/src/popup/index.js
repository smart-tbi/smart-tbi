import React from "react";
import ReactDOM from "react-dom";
import * as browser from "webextension-polyfill";
import Popup from "./Popup";
import "./index.css";

browser.runtime.sendMessage({ data: "hello" });

ReactDOM.render(<Popup />, document.getElementById("root"));
