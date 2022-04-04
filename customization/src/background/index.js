/* eslint-disable no-undef */
let message = "Background.js file loaded";

const allOptionValues = [
	"",
	"Find Friends",
	"Groups",
	"Marketplace",
	"Watch",
	"Memories",
	"Pages",
	"Saved",
	"News",
	"Events",
	"Favorites",
	"Messenger",
	"Weather"
]

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({left: true});
	chrome.storage.local.set({right: true});
	chrome.storage.local.set({stories: true});
	chrome.storage.local.set({option1: ""});
	chrome.storage.local.set({option2: ""});
	chrome.storage.local.set({option3: ""});
	chrome.storage.local.set({option4: ""});
	chrome.storage.local.set({option5: ""});
	chrome.storage.local.set({options1: allOptionValues});
	chrome.storage.local.set({options2: allOptionValues});
	chrome.storage.local.set({options3: allOptionValues});
	chrome.storage.local.set({options4: allOptionValues});
	chrome.storage.local.set({options5: allOptionValues});
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