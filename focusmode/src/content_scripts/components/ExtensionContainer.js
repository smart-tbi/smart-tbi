import React, { useState, useEffect } from "react";
import PostsBox from "./PostsBox/PostsBox";
import BottomFloatingButton from "./PostsBox/BottomFloatingButton";

/**
 * This is a parent container that keeps common states for Focus Mode components,
 * such as toggle variable for focus mode.
 *
 */

const ExtensionContainer = props => {
	/* eslint-disable no-useless-escape */
	const [showFocusMode, setShowFocusMode] = useState(false); // toggle focus mode
	const [disableExtension, setDisableExtension] = useState(false); // determines whether extension should be enabled

	var currUrl = window.location.href;

	// If url changes, reload the website to force reload the extension.
	setInterval(() => {
		if (currUrl !== window.location.href) {
			console.info("Url change detected. Reloading the extension...");
			window.location.reload();
		}
	}, 1000);

	const initialize = () => {
		if (document.querySelector("div[role='article']") === null) {
			// if there is no article element (e.g. login screen), disable extension
			console.info("No post found. Disabling extension.");
			setDisableExtension(true);
		} else {
			setDisableExtension(false);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			initialize();
		}, 1000);
	}, []);

	if (disableExtension) {
		return null;
	} else {
		return (
			<React.Fragment>
				<PostsBox
					userId={props.userId}
					showFocusMode={showFocusMode}
					setShowFocusMode={setShowFocusMode}
				/>
				<BottomFloatingButton
					showFocusMode={showFocusMode}
					setShowFocusMode={setShowFocusMode}
				/>
			</React.Fragment>
		);
	}
};

export default ExtensionContainer;
