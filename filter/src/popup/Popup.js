import React, { useState, useEffect } from "react";
import "./Popup.css";
import CustomSwitch from "./components/CustomSwitch";

const Popup = () => {
	const [toggle, setToggle] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [url, setUrl] = useState("");

	// Sends a messsage to the content scripts
	function sendMessage(message) {
		chrome.tabs.query({ currentWindow: true, active: true }, function(
			tabs
		) {
			var activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, {
				message: message
			});
		});
	}

	// Send message to content scripts to disable the extension
	function disableExtension() {
		sendMessage("DISABLE_FILTER_EXTENSION");
	}

	// Send message to content scripts to enable the extension
	function enableExtension() {
		sendMessage("ENABLE_FILTER_EXTENSION");
	}

	// On load, check if user has previously enabled the extension or not.
	useEffect(() => {
		chrome.tabs.query({ active: true }, function(tabs) {
			if (tabs[0].url.split("/")[2].includes("facebook.com")) {
				setDisabled(false);
			}
			if (tabs[0].url !== null) {
				setUrl(tabs[0].url.split("/").slice(2, 3)[0]);
			}
		});

		chrome.storage.local.get("filterExtensionToggle", item => {
			console.log(`filterExtensionToggle: ${item.filterExtensionToggle}`);
			setToggle(item.filterExtensionToggle);
		});
	}, []);

	// Handles the toggle switch, and remember the toggle state in chrome storage
	const toggleFocusMode = _toggle => {
		setToggle(_toggle);
		chrome.storage.local.set({ filterExtensionToggle: _toggle });
		if (_toggle) {
			enableExtension();
		} else {
			disableExtension();
		}
	};

	// On click of the toggle button, send the toggle state to the content scripts
	return (
		<div className="popup">
			<p className="heading">TBI Filter Extension</p>
			{disabled ? (
				<p className="subtitle">Disabled</p>
			) : (
				<CustomSwitch
					checked={toggle}
					onClick={() => toggleFocusMode(!toggle)}
				/>
			)}
			<p className="caption">{url}</p>
		</div>
	);
};

export default Popup;
