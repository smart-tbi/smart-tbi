/* eslint-disable no-undef */
let message = "Background.js file loaded";

chrome.runtime.onInstalled.addListener(() => {
	console.log(message);
});

chrome.tabs.onUpdated.addListener((_, changeInfo) => {
	updateBadge(changeInfo.url);
});

chrome.tabs.onActivated.addListener(() => {
	chrome.tabs.query({ active: true }, tabs => {
		updateBadge(tabs[0].url);
	});
});

updateBadge = url => {
	if (url !== undefined && url !== null) {
		if (
			url.split("/")[2].includes("facebook.com")
		) {
			chrome.action.setBadgeText({ text: "ON" });
		} else {
			chrome.action.setBadgeText({ text: "" });
		}
	}
};
