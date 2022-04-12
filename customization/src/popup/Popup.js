import React, { useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import "./Popup.css";

import LogDispatcher from "../content_scripts/utils/LogDispatcher";

const logDispatcher = new LogDispatcher("https://3gk7az3cca.execute-api.us-east-1.amazonaws.com/dev/log");

const Popup = () => {
	const [isLogging, setIsLogging] = useState(false);
	const [left, setLeft] = useState(true);
	const [right, setRight] = useState(true);
	const [stories, setStories] = useState(true);
	const [option1, setOption1] = useState("");
	const [option2, setOption2] = useState("");
	const [option3, setOption3] = useState("");
	const [option4, setOption4] = useState("");
	const [option5, setOption5] = useState("");

	const theme = createMuiTheme({
		palette: {
			type: "dark"
		}
	});

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

	const [options1, setOptions1] = useState(allOptionValues);
	const [options2, setOptions2] = useState(allOptionValues);
	const [options3, setOptions3] = useState(allOptionValues);
	const [options4, setOptions4] = useState(allOptionValues);
	const [options5, setOptions5] = useState(allOptionValues);

	useEffect(() => {
		chrome.tabs.query({ active: true }, function (tabs) {
			if (
				tabs[0].url.split("/")[2].includes("facebook.com")
			) {
				setDisabled(false);
			}
			if (tabs[0].url !== null) {
				setUrl(tabs[0].url.split("/").slice(2, 3)[0]);
			}
		});
	}, []);

	useEffect(() => {
		{ logDispatcher.logEventforTBIClean({ eventType: "Extension menu is toggled", eventDetail: "-" }) }
		chrome.storage.local.get(["left"], (res) => {
			setLeft(res.left);
		});
		chrome.storage.local.get(["right"], (res) => {
			setRight(res.right);
		});
		chrome.storage.local.get(["stories"], (res) => {
			setStories(res.stories);
		});
		chrome.storage.local.get(["option1"], (res) => {
			setOption1(res.option1);
		});
		chrome.storage.local.get(["option2"], (res) => {
			setOption2(res.option2);
		});
		chrome.storage.local.get(["option3"], (res) => {
			setOption3(res.option3);
		});
		chrome.storage.local.get(["option4"], (res) => {
			setOption4(res.option4);
		});
		chrome.storage.local.get(["option5"], (res) => {
			setOption5(res.option5);
		});
		// Menu dropdown options
		chrome.storage.local.get(["options1"], (res) => {
			setOptions1(res.options1);
		});
		chrome.storage.local.get(["options2"], (res) => {
			setOptions2(res.options2);
		});
		chrome.storage.local.get(["options3"], (res) => {
			setOptions3(res.options3);
		});
		chrome.storage.local.get(["options4"], (res) => {
			setOptions4(res.options4);
		});
		chrome.storage.local.get(["options5"], (res) => {
			setOptions5(res.options5);
		});
	}, []);

	useEffect(() => {
		chrome.storage.local.set({ left: left });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Left button is toggled", eventDetail: "Value set to: " + left }) }
	}, [left]);

	useEffect(() => {
		chrome.storage.local.set({ right: right });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Right button is toggled", eventDetail: "Value set to: " + right }) }
	}, [right]);

	useEffect(() => {
		chrome.storage.local.set({ stories: stories });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Stories button is toggled", eventDetail: "Value set to: " + stories }) }
	}, [stories]);

	useEffect(() => {
		chrome.storage.local.set({ option1: option1 });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Option 1 button is selected", eventDetail: "Value set to: " + option1 }) }
	}, [option1]);

	useEffect(() => {
		chrome.storage.local.set({ option2: option2 });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Option 2 button is selected", eventDetail: "Value set to: " + option2 }) }
	}, [option2]);

	useEffect(() => {
		chrome.storage.local.set({ option3: option3 });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Option 3 button is selected", eventDetail: "Value set to: " + option3 }) }
	}, [option3]);

	useEffect(() => {
		chrome.storage.local.set({ option4: option4 });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Option 4 button is selected", eventDetail: "Value set to: " + option4 }) }
	}, [option4]);

	useEffect(() => {
		chrome.storage.local.set({ option5: option5 });
		if (isLogging) { logDispatcher.logEventforTBIClean({ eventType: "Option 5 button is selected", eventDetail: "Value set to: " + option5 }) }
	}, [option5]);

	useEffect(() => {
		chrome.storage.local.set({ options1: options1 });
	}, [options1]);

	useEffect(() => {
		chrome.storage.local.set({ options2: options2 });
	}, [options2]);

	useEffect(() => {
		chrome.storage.local.set({ options3: options3 });
	}, [options3]);

	useEffect(() => {
		chrome.storage.local.set({ options4: options4 });
	}, [options4]);

	useEffect(() => {
		chrome.storage.local.set({ options5: options5 });
	}, [options5]);

	const reload = () => {
		var applyButtonEventDetail = [];

		chrome.storage.local.get(["left", "right", "stories", "option1", "option2", "option3", "option4", "option5"], function (res) {
			if (!res.left) {
				// Add Logs Event Detail
				applyButtonEventDetail.push('Left side is OFF');
			} else {
				// Add Logs Event Detail
				applyButtonEventDetail.push('Left side is ON');
				// if (res.option1 === "" && res.option2 === "" && res.option3 === "" && res.option4 === "" && res.option5 === "") {
				// 	// Add Logs Event Detail
				// 	applyButtonEventDetail.push('No option is selected for left side');
				// }
				// else {
				if (res.option1 !== "") {
					applyButtonEventDetail.push('Setting Option 1 as: ' + res.option1);
				} else {
					applyButtonEventDetail.push('Setting Option 1 as: --- <Empty Value>');
				}
				if (res.option2 !== "") {
					applyButtonEventDetail.push('Setting Option 2 as: ' + res.option2);
				} else {
					applyButtonEventDetail.push('Setting Option 2 as: --- <Empty Value>');
				}
				if (res.option3 !== "") {
					applyButtonEventDetail.push('Setting Option 3 as: ' + res.option3);
				} else {
					applyButtonEventDetail.push('Setting Option 3 as: --- <Empty Value>');
				}
				if (res.option4 !== "") {
					applyButtonEventDetail.push('Setting Option 4 as: ' + res.option4);
				} else {
					applyButtonEventDetail.push('Setting Option 4 as: --- <Empty Value>');
				}
				if (res.option5 !== "") {
					applyButtonEventDetail.push('Setting Option 5 as: ' + res.option5);
				} else {
					applyButtonEventDetail.push('Setting Option 5 as: --- <Empty Value>');
				}
				// }
			}

			if (!res.right) {
				// Add Logs Event Detail
				applyButtonEventDetail.push('Right side is OFF');
			} else {
				// Add Logs Event Detail
				applyButtonEventDetail.push('Right side is ON');
			}

			if (!res.stories) {
				// Add Logs Event Detail
				applyButtonEventDetail.push('Stories are OFF');
			} else {
				// Add Logs Event Detail
				applyButtonEventDetail.push('Stories are ON');
			}

			// Send Logs
			// { logDispatcher.logEventforTBIClean({ eventType: "Apply button is clicked", eventDetail: applyButtonEventDetail.join(", ") }) }
			
			// Send Logs
			{
				logDispatcher.logEventforTBICleanApplyButton({
					eventType: "Apply button is clicked", eventDetail: "Summary is split into separate columns",
					leftButton: applyButtonEventDetail[0],
					option1Type: applyButtonEventDetail[1],
					option2Type: applyButtonEventDetail[2],
					option3Type: applyButtonEventDetail[3],
					option4Type: applyButtonEventDetail[4],
					option5Type: applyButtonEventDetail[5],
					rightButton: applyButtonEventDetail[6],
					storiesButton: applyButtonEventDetail[7],
				})
			}
		});

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.reload(tabs[0].id);
		});
	};

	Array.prototype.insert = function (item, index) {
		this.splice(index, 0, item);
	};

	function arrayFilter(arr, removeValue, addValue) {
		console.log("Here: " + removeValue + "   " + addValue)
		var tempArray = arr;
		if (removeValue !== "") {
			tempArray = arr.filter(function (ele) {
				return ele != removeValue;
			});
		} else {
			tempArray = arr.filter(function (ele) {
				return ele != "removeValue";
			});
		}

		if (addValue === "") {
			//tempArray.insert(addValue, 0);
		} else if (addValue === "Find Friends") {
			tempArray.insert(addValue, 1);
		} else if (addValue === "Groups") {
			tempArray.insert(addValue, 2);
		} else if (addValue === "Marketplace") {
			tempArray.insert(addValue, 3);
		} else if (addValue === "Watch") {
			tempArray.insert(addValue, 4);
		} else if (addValue === "Memories") {
			tempArray.insert(addValue, 5);
		} else if (addValue === "Pages") {
			tempArray.insert(addValue, 6);
		} else if (addValue === "Saved") {
			tempArray.insert(addValue, 7);
		} else if (addValue === "News") {
			tempArray.insert(addValue, 8);
		} else if (addValue === "Events") {
			tempArray.insert(addValue, 9);
		} else if (addValue === "Favorites") {
			tempArray.insert(addValue, 10);
		} else if (addValue === "Messenger") {
			tempArray.insert(addValue, 11);
		} else if (addValue === "Weather") {
			tempArray.insert(addValue, 12);
		}

		console.log("Returning TempArray: " + tempArray)
		return tempArray;
	}

	return (
		<ThemeProvider theme={theme}>
			<div className="popup">
				<p className="heading">SMART-TBI Clean Extension</p>
				<FormGroup style={{ display: "flex", justifyContent: "start", alignContent: "start", marginTop: -10 }}>
					<div style={{ display: "flex", flexDirection: "row", marginLeft: 40, justifyContent: "space-between", alignItems: "center" }}>
						<p style={{ color: "white", fontSize: "1.3em", fontWeight: "regular", marginRight: 40 }}>Left</p>
						<Switch checked={left} onChange={() => {
							setIsLogging(true);
							setLeft(!left);
						}} />
					</div>
					<FormControl variant="standard" style={{ margin: "5px 40px", marginTop: -13 }} disabled={!left} color="secondary">
						<InputLabel>Item 1</InputLabel>
						<NativeSelect
							value={option1}
							onChange={(e) => {
								setIsLogging(true);
								setOption1(e.target.value)

								setOptions2(arrayFilter(options2, e.target.value, option1));
								setOptions3(arrayFilter(options3, e.target.value, option1));
								setOptions4(arrayFilter(options4, e.target.value, option1));
								setOptions5(arrayFilter(options5, e.target.value, option1));
							}}
						>
							{options1.map((e) => <option value={e}>{e}</option>)}
						</NativeSelect>
					</FormControl>
					<FormControl variant="standard" style={{ margin: "5px 40px" }} disabled={!left} color="secondary">
						<InputLabel>Item 2</InputLabel>
						<NativeSelect
							value={option2}
							onChange={(e) => {
								setIsLogging(true);
								setOption2(e.target.value);

								setOptions1(arrayFilter(options1, e.target.value, option2));
								setOptions3(arrayFilter(options3, e.target.value, option2));
								setOptions4(arrayFilter(options4, e.target.value, option2));
								setOptions5(arrayFilter(options5, e.target.value, option2));
							}}
						>
							{options2.map((e) => <option value={e}>{e}</option>)}
						</NativeSelect>
					</FormControl>
					<FormControl variant="standard" style={{ margin: "5px 40px" }} disabled={!left} color="secondary">
						<InputLabel>Item 3</InputLabel>
						<NativeSelect
							value={option3}
							onChange={(e) => {
								setIsLogging(true);
								setOption3(e.target.value);

								setOptions1(arrayFilter(options1, e.target.value, option3));
								setOptions2(arrayFilter(options2, e.target.value, option3));
								setOptions4(arrayFilter(options4, e.target.value, option3));
								setOptions5(arrayFilter(options5, e.target.value, option3));
							}}
						>
							{options3.map((e) => <option value={e}>{e}</option>)}
						</NativeSelect>
					</FormControl>
					<FormControl variant="standard" style={{ margin: "5px 40px" }} disabled={!left} color="secondary">
						<InputLabel>Item 4</InputLabel>
						<NativeSelect
							value={option4}
							onChange={(e) => {
								setIsLogging(true);
								setOption4(e.target.value);

								setOptions1(arrayFilter(options1, e.target.value, option4));
								setOptions2(arrayFilter(options2, e.target.value, option4));
								setOptions3(arrayFilter(options3, e.target.value, option4));
								setOptions5(arrayFilter(options5, e.target.value, option4));
							}}
						>
							{options4.map((e) => <option value={e}>{e}</option>)}
						</NativeSelect>
					</FormControl>
					<FormControl variant="standard" style={{ margin: "5px 40px" }} disabled={!left} color="secondary">
						<InputLabel>Item 5</InputLabel>
						<NativeSelect
							value={option5}
							onChange={(e) => {
								setIsLogging(true);
								setOption5(e.target.value);

								setOptions1(arrayFilter(options1, e.target.value, option5));
								setOptions2(arrayFilter(options2, e.target.value, option5));
								setOptions3(arrayFilter(options3, e.target.value, option5));
								setOptions4(arrayFilter(options4, e.target.value, option5));
							}}
						>
							{options5.map((e) => <option value={e}>{e}</option>)}
						</NativeSelect>
					</FormControl>
					<div style={{ display: "flex", flexDirection: "row", marginLeft: 40, justifyContent: "space-between", alignItems: "center" }}>
						<p style={{ color: "white", fontSize: "1.3em", fontWeight: "regular", marginRight: 40 }}>Right</p>
						<Switch checked={right} onChange={() => {
							setIsLogging(true);
							setRight(!right);
						}} />
					</div>
					<div style={{ display: "flex", flexDirection: "row", marginLeft: 40, maringBottom: 10, marginTop: -10, justifyContent: "space-between", alignItems: "center" }}>
						<p style={{ color: "white", fontSize: "1.3em", fontWeight: "regular", marginRight: 40 }}>Stories</p>
						<Switch checked={stories} onChange={() => {
							setIsLogging(true);
							setStories(!stories);
						}} />
					</div>
				</FormGroup>
				<Button style={{ marginBottom: 12 }} className="toggle" onClick={reload} variant="contained" color="secondary" disableElevation>
					Apply
				</Button>
			</div>
		</ThemeProvider>

	);
};

export default Popup;
