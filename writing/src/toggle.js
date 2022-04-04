import React from "react";
import ReactDOM from "react-dom";
import HoverBox from "../content_scripts/components/HoverBox/HoverBox";

console.log("ddedle")
chrome.storage.sync.get('toggle', function (toggle) {
	console.log(toggle)
	if (toggle === false) {
		// chrome.storage.sync.set({ toggle: 'off' });
		console.log("Toggle 1: " + toggle)
		let hover = document.getElementById("tbi-writing-hover-box");
		console.log("HI     1" + typeof (hover) != 'undefined' && hover != null)
		if (typeof (hover) != 'undefined' && hover != null) {
			console.log("Inside 1")
			ReactDOM.unmountComponentAtNode(
				document.getElementById("tbi-writing-hover-box")
			);
			document.body.removeChild(
				document.getElementById("tbi-writing-hover-box")
			);
		}
	} else {
		// chrome.storage.sync.set({ toggle: 'on' });
		console.log("Toggle 2: " + toggle)
		let hover = document.getElementById("tbi-writing-hover-box");
		console.log("HI     2" + typeof (hover) != 'undefined' && hover != null)
		console.log("kjhguftydrsetdfyguh")
		if (typeof (hover) != 'undefined' && hover != null) {
			console.log("Inside 2")
			let hoverBox = document.createElement("div");
			hoverBox.id = "tbi-writing-hover-box";
			document.body.appendChild(hoverBox);
			ReactDOM.render(
				<HoverBox />,
				document.getElementById("tbi-writing-hover-box")
			);
		}
		// }
	}
});

