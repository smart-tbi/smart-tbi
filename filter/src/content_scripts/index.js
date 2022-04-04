import React from "react";
import ReactDOM from "react-dom";
import ExtensionContainer from "./components/ExtensionContainer";

setTimeout(() => {
	main();
}, 1000);

// Insert a container DOM to be occupied by the extension
function createUtilityDOMs() {
	console.log("Creating utility DOMs");
	const extensionArea = document.createElement("div");

	extensionArea.id = "tbi-filter";

	document.body.appendChild(extensionArea);
}

// Render the extension
function main() {
	// Check the user settings if the extension was previously enabled
	chrome.storage.local.get("filterExtensionToggle", (item) => {
		if (item.filterExtensionToggle) {
			createUtilityDOMs();

			ReactDOM.render(
				<ExtensionContainer chrome={chrome} />,
				document.getElementById("tbi-filter")
			);
		}
	});

	let lastUrl = location.href;
	new MutationObserver(() => {
		const url = location.href;
		if (url !== lastUrl) {
			lastUrl = url;
			if (url.split("/")[2].includes("facebook.com")) {
				createUtilityDOMs();
			}
		}
	}).observe(document, { subtree: true, childList: true });

	// Handle messages from popup
	chrome.runtime.onMessage.addListener(function(
		request,
		sender,
		sendResponse
	) {
		if (request.message === "DISABLE_FILTER_EXTENSION") {
			ReactDOM.unmountComponentAtNode(
				document.getElementById("tbi-filter")
			);
			document.getElementById("tbi-filter-alert-area").style.visibility = "none";
			document.getElementById("tbi-filter-bottom-bar-offset").style.visibility = "none";
			document.querySelectorAll("div[role='article']").forEach(element => {
				element.classList.remove("filtered");
				element.classList.remove("hide");
			});
		} else if (request.message === "ENABLE_FILTER_EXTENSION") {
			createUtilityDOMs();
			ReactDOM.render(
				<ExtensionContainer />,
				document.getElementById("tbi-filter")
			);
		}
	});

	console.log("TBI-Filter: Content scripts has loaded!");
}