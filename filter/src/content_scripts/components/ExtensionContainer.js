import React, { useState, useEffect } from "react";
import PostsBox from "./PostsBox/PostsBox";
import BottomFloatingBar from "./PostsBox/BottomFloatingBar";
import CircularProgress from "@material-ui/core/CircularProgress";

/**
 * This is a parent container that keeps common states for Focus Mode components,
 * such as toggle variable for focus mode.
 *
 */
const ExtensionContainer = props => {
	const [isFilterEnabled, setIsFilterEnabled] = useState(false); // toggle filter
	const [loading, setLoading] = useState(false);
	const [showExtension, setShowExtension] = useState(false); // determines whether extension should be enabled

	/* Post Filter */
	const [postFilter, setPostFilter] = useState({
		PERSONAL: false,
		GROUP: false,
		PAGE: false,

		externalLink: false,
		img: false,
		video: false,

		POSITIVE: false,
		NEGATIVE: false,
		NEUTRAL: false
	});

	const allowedUrlRegex = /^.*facebook.com\/*(\?sk=h_chr)*$/gm;

	function createUtilityDOMs() {
		console.log("Creating utility DOMs");
		const alertArea = document.createElement("div");
		const bottomBarOffsetArea = document.createElement("div");
	
		alertArea.id = "tbi-filter-alert-area";
		bottomBarOffsetArea.id = "tbi-filter-bottom-bar-offset";
		bottomBarOffsetArea.style.height = "100px";
	
		document.querySelector("div[role='feed']").prepend(alertArea);
		document.querySelector("div[role='feed']").append(bottomBarOffsetArea);
	}

	useEffect(() => {
		if (document.querySelector("div[role='feed']") === null) {
			// if there is no feed element, disable extension
			setShowExtension(false);
		} else {
			createUtilityDOMs();
			
		}
	}, []);

	useEffect(
		// if the user is not on fb homepage, disable extension
		() => {
			if (allowedUrlRegex.exec(window.location.href) === null) {
				setShowExtension(false);
			} else {
				setShowExtension(true);
			}
		},
		[window.location.href]
	);

	useEffect(
		() => {
			// When user changes filter,
			// scroll to top

			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});

			if (Object.values(postFilter).includes(true)) {
				setIsFilterEnabled(true);
			} else {
				setIsFilterEnabled(false);
			}
		},
		[postFilter]
	);

	const LoadingIndicator = ({ loading }) => {
		if (loading) {
			return (
				<div className="loading-spinner">
					<CircularProgress color="primary" />
					<span>Loading..</span>
				</div>
			);
		} else {
			return null;
		}
	};

	return (
		<React.Fragment>
			<LoadingIndicator show={loading} />

			{/* Actual filtering logic are done in <PostsBox> */}
			<PostsBox
				postFilter={postFilter}
				isFilterEnabled={isFilterEnabled}
				loading={loading}
				setLoading={setLoading}
			/>

			{/* Bottom floating bar where users can select filter settings */}
			<BottomFloatingBar
				postFilter={postFilter}
				setPostFilter={setPostFilter}
				isFilterEnabled={isFilterEnabled}
				setIsFilterEnabled={setIsFilterEnabled}
				loading={loading}
				setLoading={setLoading}
				show={showExtension}
			/>
		</React.Fragment>
	);
};

export default ExtensionContainer;
