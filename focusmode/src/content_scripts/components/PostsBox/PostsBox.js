/* eslint-disable */

import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import {
	withStyles,
	createTheme,
	ThemeProvider
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import { parsePost } from "../../utils/PostParser";
import "./PostsBox.css";
import Post from "./Post";

const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const useStyles = makeStyles(theme => ({
	profileImg: {
		marginLeft: "0.5rem"
	},
	profileName: {
		color: "#ffffff",
		margin: "0 1rem",
		fontSize: "1.25rem",
		fontWeight: 600,
		textTransform: "none",
	},
	groupName: {
		color: "#ffffff",
		margin: "0 1rem"
	  },
	verified: {
		color: "#1876f3"
	},
	arrow: {
		transform: "scale(1.8)",
		color: "#d25913",
	},
	arrowContainer: {
		backgroundColor: "#c4c4c4",
	},
	logo: {
		position: "absolute",
		right: "1rem",
		bottom: "1rem",
		width: "24px",
		height: "24px",
	}
}));

const PostsBox = props => {
	const [posts, setPosts] = useState([]);
	const [structuredPosts, setStructuredPosts] = useState([]); // array of posts in a structured, reusable JSON format
	const [currentPost, setCurrentPost] = useState(null);
	const [currentPostIdx, setCurrentPostIdx] = useState(0);
	const [themed, setThemed] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const { height, width } = useWindowDimensions();
	const [logged, setLogged] = useState([]);
	const [seenPosts, setSeenPosts] = useState([]);
	
	const [lastParsedPostIdx, setLastParsedPostIdx] = useState(-1);

	const [isLoading, setIsLoading] = useState(false);

	const classes = useStyles();

	const checkLeftRightArrowPressed = e => {
		e = e || window.event;

		if (e.keyCode == "37") {
			// left
			document.querySelector("#tbi_previous_post").click();
		} else if (e.keyCode == "39") {
			// right
			document.querySelector("#tbi_next_post").click();
		}
	};

	const loadMorePosts = (currPostCount, numMaxPosts) => {
		setIsLoading(true);

		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 500);
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 1000);
		setIsLoading(false);

		sleep(1000).then(() => {
			setCurrentPostIdx(currentPostIdx + 1);
		});
	};

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height
		};
	}

	function useWindowDimensions() {
		const [windowDimensions, setWindowDimensions] = useState(
			getWindowDimensions()
		);

		useEffect(() => {
			function handleResize() {
				setWindowDimensions(getWindowDimensions());
			}

			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}, []);

		return windowDimensions;
	}

	useEffect(() => {
		findPosts();
		setCurrentPostIdx(0);
		window.addEventListener("scroll", findPosts);
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 300);
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 700);
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 1000);
		document.onkeydown = checkLeftRightArrowPressed;

		return () => {
			window.removeEventListener("scroll", findPosts);
		};
	}, []);

	const dialogRef = useCallback(
		node => {
			// insert fabs
			if (node !== null && node.childNodes[2].children.length == 1) {
				var prevPostFabDiv = document.createElement("div");
				var nextPostFabDiv = document.createElement("div");
				ReactDOM.render(<PrevPostFab />, prevPostFabDiv);
				ReactDOM.render(<NextPostFab />, nextPostFabDiv);
				node.childNodes[2].prepend(prevPostFabDiv);
				node.childNodes[2].appendChild(nextPostFabDiv);
			}
		},
		[currentPostIdx]
	);

	useEffect(
		() => {
			if (!props.showFocusMode) return;

			if (currentPostIdx < 0) {
				setCurrentPostIdx(0);
				return;
			}
			
			if (!(seenPosts.includes(currentPostIdx))){
				let newSeenPosts = [...seenPosts, currentPostIdx]
				setSeenPosts(newSeenPosts)
			}


			// disable previous post button if user is viewing the first post
			if (document.querySelector("#prev-post-fab") !== null) {
				if (currentPostIdx === 0) {
					document.querySelector("#prev-post-fab").classList.add("Mui-disabled");
				} else {
					document.querySelector("#prev-post-fab").classList.remove("Mui-disabled");
					document.querySelector("#prev-post-fab").removeAttribute("disabled");
				}
			}
		},
		[currentPostIdx, props.showFocusMode]
	);

	useEffect(() => findTheme(), [currentPost]);

	const findPosts = () => {
		// eslint-disable-next-line quotes

		const postList = [...posts];
		const parsedPostList = [...structuredPosts];

		const allPosts = document.querySelectorAll('[role="article"]'); // All posts in the feed
		let startIdx = lastParsedPostIdx + 1;

		// if (parsedPostList.length > 0) {
		// 	startIdx = parsedPostList[parsedPostList.length - 1].elementIdx + 1;
		// }
		for (let i = startIdx; i < allPosts.length; i++) {
			// Do not add posts that have parsing issues
			if (allPosts[i].textContent === undefined) continue; 
			
			if (
				allPosts[i].getAttribute("aria-label") !== null ||
				allPosts[i].getAttribute("aria-label")?.startsWith("Comment")
			) {
				continue;
			}

			if (
				allPosts[i].textContent.includes("was tagged.") ||
				allPosts[i].textContent.includes("liked a post.") ||
				allPosts[i].textContent
					.toLowerCase()
					.includes("suggested for you") ||
				allPosts[i].textContent.includes(" commented.") ||
				allPosts[i].textContent.includes("People You May Know") ||
				allPosts[i].textContent.includes("shared a memory.") ||
				allPosts[i].textContent.includes("Reels and short videos") ||
				allPosts[i].textContent.includes("Paid for by")
			) {
				continue;
			}

			if (
				allPosts[i].querySelectorAll("h5").length === 2
			) {
				// ignore shared post
				continue;
			}

			let seeMoreButton = Array.from(
				allPosts[i].querySelectorAll('div[role="button"]')
			).find(el => el.textContent === "See more");
			if (seeMoreButton !== undefined) {
				seeMoreButton.click();
			}

			// 1. Deep copy new post DOMs from the feed
			let newPostDOM = allPosts[
				i
			].firstChild.firstChild.firstChild.cloneNode(true);
			if (!(i in logged)){
				parsePost(allPosts[
					i
				].firstChild.firstChild.firstChild)	
				setLogged([...logged, i]);

			}
			postList.push(newPostDOM);

			// 2. Parse posts into a structured format
			let parsed = parsePost(newPostDOM);
			if (parsed.name === undefined) continue;
			parsed.idx = postList.length - 1;
			parsed.elementIdx = i; // original index
			parsedPostList.push(parsed);
		}

		// 3. Store 1 and 2 in state!
		setPosts(_ => [...postList]);
		setStructuredPosts(_ => [...parsedPostList]);
		setLastParsedPostIdx(allPosts.length-1);
	};

	const getPost = idx => {
		const postDetail = [];
		const currPostDOM = posts[idx];

		// If the post is not in the specific window, FB hides it.
		// So, make the post visible if hidden
		if (currPostDOM.querySelector("[hidden]") !== null) {
			currPostDOM.removeAttribute("hidden");
		}

		if (structuredPosts.length >= 1) {
			if (
				structuredPosts[idx] != undefined ||
				structuredPosts[idx] != null
			) {
				for (const [key, value] of Object.entries(
					structuredPosts[idx]
				)) {
					postDetail.push(
						<li key={idx + "_" + key}>
							{key} : {value}
						</li>
					);
				}
			}
		}

		return posts[idx];
	};

	const findTheme = () => {
		if (currentPost !== null && !themed) {
			// eslint-disable-next-line quotes
			let textDivs = currentPost.querySelectorAll(
				'[style^="text-align:"]'
			);
			for (let j = 0; j < textDivs.length; j++) {
				if (textDivs[j] && textDivs[j].innerText) {
					if (
						window
							.getComputedStyle(
								textDivs[j].parentNode.parentNode,
								null
							)
							.getPropertyValue("color") === "rgb(5, 5, 5)"
					) {
						setDarkMode(false);
					} else {
						setDarkMode(true);
					}
					setThemed(true);
					return;
				}
			}
		}
	};

	const showPrevPost = () => {
		if (currentPostIdx == 0) {
			alert("This is the first post!");
			return;
		}

		setCurrentPostIdx(currentPostIdx - 1);
	};

	const scrollToCurrentPost = () => {
		let elementIdx = structuredPosts[currentPostIdx].elementIdx;

		document
			.querySelectorAll('[role="article"]')
			[elementIdx].scrollIntoView({ block: "center" });
	};

	const showNextPost = () => {		
		if (currentPostIdx > posts.length - 10) {
			window.scrollTo(0, document.body.scrollHeight);
			loadMorePosts(posts.length, currentPostIdx + 10);
			return;
		}

		setCurrentPostIdx(currentPostIdx + 1);
	};

	const theme = createTheme({
		palette: {
			type: "dark"
		}
	});

	const PrevPostFab = props => {
		return (<Fab
			id="prev-post-fab"
			className={`${classes.arrowContainer} Mui-disabled`}
			aria-label="previous post"
			onClick={() => {
				document.querySelector("#tbi_previous_post").click();
			}}
		>
			<ArrowBackIcon className={classes.arrow}/>
		</Fab>);
	};

	const NextPostFab = props => {
		return (<Fab
			className={classes.arrowContainer}
			aria-label="next post"
			onClick={() => {
				document.querySelector("#tbi_next_post").click();
			}}
		>
			<ArrowForwardIcon className={classes.arrow}/>
		</Fab>);
	};

	const getProfileArea = () => {
		return (
			<Box display="flex" alignItems="center">
				<Avatar
					className={classes.profileImg}
					src={structuredPosts[currentPostIdx]?.profileImg}
				/>
				<Box display="flex" flexDirection="column">
					<Typography
						className={classes.profileName}
						variant="button"
						display="block"
					>
						{structuredPosts[currentPostIdx]?.name} 
					</Typography>
					{structuredPosts[currentPostIdx]?.groupName && 
					<Typography
						className={classes.groupName}
						variant="caption"
						display="block"
					>
						from {structuredPosts[currentPostIdx]?.groupName}
					</Typography> }
				</Box>
				{structuredPosts[currentPostIdx]?.verified && (
					<CheckCircleIcon className={classes.verified} />
				)}
			</Box>
		);
	};

	return (
		<ThemeProvider theme={theme}>
			<Dialog
				PaperProps={{
					style: {
						backgroundColor: "#4f4f4f",
						borderRadius: 10,
						marginBottom: "7rem",
					}
				}}
				disableEnforceFocus
				disableBackdropClick
				BackdropProps={{ style: { background: "rgba(0,0,0,0.8)" } }}
				onClose={() => {}}
				open={props.showFocusMode}
				ref={dialogRef}
				maxWidth={false}
			>
				<div style={{ overflow: "hidden", width: width * 0.75, height: height*0.8 }}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						flexDirection="row"
						style={{ padding: "0.75rem 0.5rem" }}
					>
						{getProfileArea()}
						<IconButton
							onClick={() => props.setShowFocusMode(false)}
						>
							<CloseIcon />
						</IconButton>
					</Box>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						flexDirection="row"
						style={{
							padding: "10px 15px",
							paddingTop: 0,
							display: "none"
						}}
					>
						<Button
							id="tbi_previous_post"
							disabled={currentPostIdx === 0}
							startIcon={<ArrowBackIcon />}
							onClick={showPrevPost}
						>
							Previous
						</Button>
						<Button
							id="tbi_next_post"
							disabled={currentPostIdx === posts.length - 1}
							endIcon={<ArrowForwardIcon />}
							onClick={showNextPost}
						>
							Next
						</Button>
					</Box>
					{/* <Divider /> */}
					<div
						id="postArea"
						style={{
							backgroundColor: "#4f4f4f"
						}}
					>
						{posts.length > currentPostIdx && (
							<Post
								post={getPost(currentPostIdx)}
								elementIdx={
									structuredPosts[currentPostIdx].elementIdx
								}
								data={structuredPosts[currentPostIdx]}
								scrollToCurrentPost={scrollToCurrentPost}
								setShowFocusMode={props.setShowFocusMode}
								postAreaHeight={height*0.8}
							/>
						)}
					</div>
				</div>
			</Dialog>
		</ThemeProvider>
	);
};

export default PostsBox;
