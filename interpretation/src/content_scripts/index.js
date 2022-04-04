import React from "react";
import ReactDOM from "react-dom";
import HoverBox from "./components/HoverBox/HoverBox";

setTimeout(() => {
	chrome.storage.sync.set({
		toggle: true
	});
	
	let hoverBox = document.createElement("div");
	hoverBox.id = "sense-trans-hover-box";
	document.body.appendChild(hoverBox);

	let hoverButton = document.createElement("div");
	hoverButton.id = "sense-trans-hover-button";
	document.body.appendChild(hoverButton);

	ReactDOM.render(
		<HoverBox />,
		document.getElementById("sense-trans-hover-box")
	);
	let lastUrl = location.href;
	new MutationObserver(() => {
		const url = location.href;
		if (url !== lastUrl) {
			lastUrl = url;
			if (
				url.split("/")[2].includes("facebook.com")
			) {
				// refresh the page to re-render the hover box whenever user moves to another page in fb
				window.location.reload();
			} else {
				let hover = document.getElementById("sense-trans-hover-box");
				if (hover) {
					ReactDOM.unmountComponentAtNode(
						document.getElementById("sense-trans-hover-box")
					);
					document.body.removeChild(
						document.getElementById("sense-trans-hover-box")
					);
				}
			}
		}
	}).observe(document, { subtree: true, childList: true });

	console.log("Content scripts has loaded!");
}, 1000);

chrome.storage.local.get("sessionIdsToUpload", (item) => {
	chrome.storage.local.set({ "sessionIdsToUpload": [] });
	console.log("sessionIdsToUpload is initialized");
});

// start a timer that tracks usage time for the current session
setInterval(() => {
	// get current session id
	let sessionId = sessionStorage.getItem("tbi-session-id");

	// only run timer if there is a session id and user is on a facebook tab
	if (sessionId && document.hasFocus()) {

		chrome.storage.local.get("sessionIdsToUpload", (item) => {
			if (item.sessionIdsToUpload.includes(sessionId)) {
			} else {
				item.sessionIdsToUpload.push(sessionId);
				chrome.storage.local.set({ "sessionIdsToUpload": Array.from(new Set([...item.sessionIdsToUpload, sessionId]))});
			}
		});

		chrome.storage.local.get([sessionId], function(item) {
			chrome.storage.local.set({[sessionId] : (item[sessionId] || 0) + 1},function(){});
		});
	}
}, 1000);