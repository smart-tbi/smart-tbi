import React from "react";
import ReactDOM from "react-dom";
import HoverBox from "./components/HoverBox/HoverBox";

setTimeout(() => {
	chrome.storage.sync.set({
		toggle: true
	});

	let hoverBox = document.createElement("div");
	hoverBox.id = "tbi-writing-hover-box";
	document.body.appendChild(hoverBox);
	ReactDOM.render(
		<HoverBox />,
		document.getElementById("tbi-writing-hover-box")
	);
	let lastUrl = location.href;
	new MutationObserver(() => {
		const url = location.href;
		if (url !== lastUrl) {
			lastUrl = url;
			if (url.split("/")[2].includes("facebook.com")) {
				document.body.appendChild(hoverBox);
				ReactDOM.render(
					<HoverBox />,
					document.getElementById("tbi-writing-hover-box")
				);
			} else {
				let hover = document.getElementById("tbi-writing-hover-box");
				if (hover) {
					ReactDOM.unmountComponentAtNode(
						document.getElementById("tbi-writing-hover-box")
					);
					document.body.removeChild(
						document.getElementById("tbi-writing-hover-box")
					);
				}
			}
		}
	}).observe(document, { subtree: true, childList: true });

	console.log("Content scripts has loaded!");
}, 1000);
