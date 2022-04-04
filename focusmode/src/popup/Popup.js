import React, { useState, useEffect } from "react";
import "./Popup.css";
import Button from "@material-ui/core/Button";
import CustomSwitch from "./components/CustomSwitch";

const Popup = () => {
	const [toggle, setToggle] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [url, setUrl] = useState("");

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

	function disableExtension() {
		sendMessage("DISABLE_FOCUSMODE_EXTENSION");
	}

	function enableExtension() {
		sendMessage("ENABLE_FOCUSMODE_EXTENSION");
	}

	useEffect(() => {
		chrome.tabs.query({ active: true }, function(tabs) {
			if (tabs[0].url.split("/")[2].includes("facebook.com")) {
				setDisabled(false);
			}
			if (tabs[0].url !== null) {
				setUrl(tabs[0].url.split("/").slice(2, 3)[0]);
			}
		});

		chrome.storage.local.get("focusModeToggle", item => {
			setToggle(item.focusModeToggle);
		});
	}, []);

	const toggleFocusMode = _toggle => {
		setToggle(_toggle);
		chrome.storage.local.set({ focusModeToggle: _toggle });
		if (_toggle) {
			enableExtension();
		} else {
			disableExtension();
		}
	};

	return (
		<div className="popup">
			<p className="heading">TBI Focus Mode Extension</p>
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
