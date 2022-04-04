import React, { useState, useEffect } from "react";
import "./Popup.css";
import CustomSwitch from "./components/CustomSwitch";

const Popup = () => {
	const [toggle, setToggle] = useState(true);
	const [disabled, setDisabled] = useState(true);
	const [url, setUrl] = useState("");

	useEffect(() => {
		chrome.tabs.query({ active: true }, function(tabs) {
			if (tabs[0].url.split("/")[2].includes("facebook.com")) {
				setDisabled(false);
			}
			if (tabs[0].url !== null) {
				setUrl(tabs[0].url.split("/").slice(2, 3)[0]);
			}
		});
		chrome.storage.sync.get("toggle", function(toggle) {
			var isTrueSet = String(toggle.toggle) === "true";
			setToggle(isTrueSet);
		});
	}, []);

	useEffect(
		() => {
			console.log(`Toggle: ${toggle}`);
			chrome.tabs.query(
				{
					currentWindow: true,
					active: true
				},
				(currentWindowActiveTabs = []) => {
					console.log(currentWindowActiveTabs);
					console.log(currentWindowActiveTabs[0]);
					if (currentWindowActiveTabs.length) {
						chrome.storage.sync.set(
							{
								toggle: toggle
							},
							function() {
								chrome.scripting.executeScript({
									target: {
										tabId: currentWindowActiveTabs[0].id
									},
									files: ["toggle.js"]
								});
							}
						);
					}
				}
			);
		},
		[toggle]
	);

	return (
		<div className="popup">
			<p className="heading">SMAT-TBI Interpretation Extension</p>
			{disabled ? (
				<>
					<p className="subtitle">DISABLED</p>
				</>
			) : (
				<CustomSwitch
					checked={toggle}
					onClick={() => setToggle(!toggle)}
				/>
			)}
			<p className="caption">{url}</p>
		</div>
	);
};

export default Popup;
