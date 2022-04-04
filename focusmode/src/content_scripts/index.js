import React from "react";
import ReactDOM from "react-dom";
import ExtensionContainer from "./components/ExtensionContainer";

setTimeout(() => {
	let postsBox = document.createElement("div");
	postsBox.id = "tbi-focusmode";
	document.body.appendChild(postsBox);

	ReactDOM.render(
		<ExtensionContainer />,
		document.getElementById("tbi-focusmode")
	);

	console.log("TBI-Focusmode: Content scripts has loaded!");
}, 1000);