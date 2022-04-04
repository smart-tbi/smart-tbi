import React from "react";
import ReactDOM from "react-dom";
import * as browser from "webextension-polyfill";
import Popup from "./Popup";
import "./index.css";

ReactDOM.render(
	<Popup />,
	document.getElementById("root")
);
