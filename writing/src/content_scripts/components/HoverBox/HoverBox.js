import React, { useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import BoxContent from "../BoxContent/BoxContent";
import "./HoverBox.css";

const HoverBox = props => {
	const [inputBox, setInputBox] = useState(null);
	const [inputText, setInputText] = useState("");
	const [publicText, setPublicText] = useState("");
	const [open, setOpen] = useState(true);
	const [activePageIndex, setActivePageIndex] = useState(0);
	const [toggleHere, setToggleHere] = useState("true");

	const redTheme = createMuiTheme({
		palette: {
			primary: {
				main: "#a9003c"
			},
			secondary: {
				main: "#ff1065"
			}
		},
		typography: {
			button: {
				fontSize: 11
			}
		}
	});

	const defaultHeaderStyles = {
		lineHeight: "40px",
		paddingLeft: "15px",
		height: "40px",
		borderRadius: "10px 10px 0 0",
		backgroundColor: "#002630",
		color: "#FFFFFF",
		fontSize: "14px",
		fontWeight: "500",
		overflow: "hidden"
	};

	const defaultFooterStyles = {
		height: "50px",
		boxSizing: "border-box",
		background: "#002630",
		overflow: "hidden",
		borderRadius: "0px 0px 10px 10px"
	};

	useEffect(() => {
		chrome.storage.sync.get("toggle", function(toggle) {
			var isTrueSet = String(toggle.toggle) === "true";
			if (!isTrueSet) {
				setToggleHere("false");
			} else {
				setToggleHere("true");
			}
		});
	});

	useEffect(() => {
		findInput();
		document.addEventListener("DOMSubtreeModified", findInput);
		return () => {
			document.removeEventListener("DOMSubtreeModified", findInput);
		};
	}, []);

	useEffect(
		() => {
			if (inputBox === null) {
				setOpen(false);
			} else {
				findContent();
				findPublicSetting();
				inputBox.addEventListener("DOMSubtreeModified", findContent);
				inputBox.addEventListener(
					"DOMSubtreeModified",
					findPublicSetting
				);
			}
		},
		[inputBox]
	);

	const findContent = () => {
		// eslint-disable-next-line quotes
		const dataDivs = inputBox.querySelectorAll('[data-block="true"]');
		let content = "";
		for (let i = 0; i < dataDivs.length; i++) {
			// eslint-disable-next-line quotes
			const spans = dataDivs[i].querySelectorAll('[data-text="true"]');
			let text = "";
			for (let j = 0; j < spans.length; j++) {
				text += spans[j].innerText;
			}
			content += "\n" + text;
		}
		if (content !== "" && content !== "\n") {
			setInputText(content);
		}
		setOpen(true);
	};

	const findInput = () => {
		setTimeout(() => {
			// eslint-disable-next-line quotes
			const input = document.querySelector(
				`[aria-label^="What's on your mind"][role="textbox"]`
			);
			setInputBox(input);
		}, 500);
	};

	const findPublicSetting = () => {
		const dataDivs = document.querySelector(
			`[aria-label^="Edit privacy"][role="button"]`
		);
		// console.log(dataDivs.getAttribute("aria-label").slice(14))
		setPublicText(dataDivs.getAttribute("aria-label").slice(14));
	};

	const theme = createMuiTheme({
		palette: {
			type: "dark"
		},
		typography: {
			button: {
				fontSize: 12
			}
		}
	});

	const setPrevActivePageIndex = () => {
		setActivePageIndex(activePageIndex - 1);
	};

	const setNextActivePageIndex = () => {
		setActivePageIndex(activePageIndex + 1);
	};

	const updatePublicText = isSummary => {
		findPublicSetting();
		var headerText = isSummary
			? "Summary - 4. Privacy Setting Check"
			: "4. Privacy Setting Check";
	};

	const renderNextButtonText = param => {
		switch (param) {
			case 0:
				return "1. Grammar >";
			case 1:
				return "2. Toxicity >";
			case 2:
				return "3. Sentiment >";
			case 3:
				return "4. Privacy >";
			case 4:
				return "Summary >";
			case 5:
				return "Text Evolution >";
			default:
				return "";
		}
	};

	const renderHeaderText = param => {
		switch (param) {
			case 0:
				return "Introduction";
			case 1:
				return "1. Grammar and Spelling Check";
			case 2:
				return "2. Toxicity Check";
			case 3:
				return "3. Sentiment Check";
			case 4:
				return "4. Privacy Setting Check";
			case 5:
				return "Summary";
			case 6:
				return "Text Evolution";
			default:
				return "";
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Popper
				className="writing-hover-box"
				open={open}
				anchorEl={!open ? document.body : inputBox}
				placement="right-start"
				style={
					toggleHere === "true"
						? { display: "" }
						: { display: "none" }
				}
			>
				{({ TransitionProps }) => (
					<div>
						<div style={defaultHeaderStyles}>
							{renderHeaderText(activePageIndex)}
						</div>

						<Fade {...TransitionProps} timeout={200}>
							<BoxContent
								inputText={inputText}
								publicText={publicText}
								activePageIndex={activePageIndex}
								updatePublicText={updatePublicText}
							/>
						</Fade>

						<div style={defaultFooterStyles}>
							<div style={{ padding: "10px" }}>
								<ThemeProvider theme={redTheme}>
									<Button
										id="previous_button"
										variant="contained"
										color="primary"
										disableElevation
										disabled={activePageIndex === 0}
										onClick={setPrevActivePageIndex}
										style={{ float: "left" }}
									>
										Prev
									</Button>
									<Button
										id="next_button"
										variant="contained"
										color="secondary"
										disableElevation
										disabled={activePageIndex === 6}
										onClick={setNextActivePageIndex}
										style={{ float: "right" }}
									>
										{renderNextButtonText(activePageIndex)}
									</Button>
								</ThemeProvider>
							</div>
						</div>
					</div>
				)}
			</Popper>
		</ThemeProvider>
	);
};

export default HoverBox;
