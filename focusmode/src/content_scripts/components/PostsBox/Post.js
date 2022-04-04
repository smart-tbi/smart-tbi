/* eslint-disable next-line, no-unexpected-multiline, quotes */
import React, { useState, useEffect, useRef, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import SendIcon from "@material-ui/icons/Send";
import clsx from "clsx";
import { orange } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

import "./Post.css";

const useStyles = makeStyles(theme => ({
	btnOrange: {
		fontWeight: 800,
		margin: theme.spacing(1),
		color: theme.palette.common.white,
		backgroundColor: orange[800],
		"&:hover": {
			backgroundColor: "#aa4a13"
		}
	},
	btnOrangeEnabled: {
		backgroundColor: "#aa4a13",
		"&:hover": {
			backgroundColor: orange[800]
		}
	}
}));

const Post = props => {
	// Refs for rendering header, content, and footer action buttons of a post
	// const headerRef = useRef();
	const textContentRef = useRef();
	const photoContentRef = useRef();
	const [contentText, setContentText] = useState("");
	const [liked, setLiked] = useState(false);
	const [photoScaleRate, setPhotoScaleRate] = useState(1);

	const classes = useStyles();

	useEffect(() => {
		// eslint-disable-next-line quotes
		let header;
		let content;
		let photoContent;
		try {
			header = props.post.querySelector("a[role='link']").parentNode
				.parentNode.parentNode.parentNode;

			if (header.nextSibling === null) {
				content = header.parentNode.nextSibling; // group posts
			} else {
				content = header.nextSibling; // individiaul posts
			}

			let textContent = content.firstChild;
			if (
				textContent.innerText === "" &&
				textContent.querySelector("img")
			) {
				photoContent = textContent; // when there is no text in post
			} else {
				photoContent = textContent.nextSibling;
			}
			let actionButtons = content.nextSibling;

			// postViewRef.current.innerHTML = posts[idx].innerHTML;
			// headerRef.current.innerHTML = header.innerHTML;
			// textContentRef.current.innerHTML = textContent.innerHTML;
			setContentText(textContent.innerText);
			if (photoContent !== null) {
				photoContentRef.current.innerHTML = photoContent.innerHTML;
				if (photoContent.querySelector("video")) {
					photoContentRef.current.onclick = () => {
						document
							.querySelectorAll("div[role='article']")[props.elementIdx].querySelector("video")
							.requestFullscreen();
						props.scrollToCurrentPost();
					};
				} else {
					photoContentRef.current.onclick = null;
				}
			} else {
				photoContentRef.current.innerText = "No Photos";
			}
		} catch (error) {
			console.error("Error while trying to parse the post");
			console.error(error);
			return;
		}
	}, [props.elementIdx]);

	const likePost = () => {
		let roleButtons = document
			.querySelectorAll('[role="article"]')
			[props.elementIdx].querySelectorAll('[role="button"]');
		for (let j = 0; j < roleButtons.length; j++) {
			if (
				roleButtons[j].getAttribute("aria-label") &&
				roleButtons[j].getAttribute("aria-label") === "Like"
			) {
				roleButtons[j].click();
				setLiked(true);
				return;
			}
			else if (
				roleButtons[j].getAttribute("aria-label") &&
				roleButtons[j].getAttribute("aria-label") === "Remove Like"
			) {
				roleButtons[j].click();
				setLiked(false);
				return;
			}
		}
	};

	useEffect(() => {
		if (props.post.querySelector('[aria-label="Remove Like"]')){
			setLiked(true);
		} else {
			setLiked(false);
		}

		setPhotoScaleRate(1); // initialize scale

		setTimeout(() => {
			let actualPhotoHeight = photoContentRef.current.getBoundingClientRect().height;
			let maxPhotoAreaHeight = props.postAreaHeight * 0.75;
	
			console.log(`actual: ${actualPhotoHeight} | maxHeight: ${maxPhotoAreaHeight}`);
	
			if (actualPhotoHeight < maxPhotoAreaHeight) {
				setPhotoScaleRate(1);
			} else {
				let diff = actualPhotoHeight - maxPhotoAreaHeight;
				let scale = 1 - (diff / actualPhotoHeight);
		
				setPhotoScaleRate(scale);
			}
		}, 200); // wait 0.2 sec for the browser to draw the layout
	}, [props.elementIdx]);


	return (
		<div id="postContent">
			<Grid container style={{padding: "0 0.5rem"}} alignItems="flex-start">
				<Grid item xs={7}>
					<Paper
						style={{
							maxHeight: props.postAreaHeight * 0.75,
							padding: "1rem 0.5rem",
							margin: "1rem 0.5rem",
							backgroundColor: "#d0d0d0",
						}}
					>
						<div id="tbi-post-photo" style={photoScaleRate < 1 ? {margin:"0 auto", transform: `scale(${photoScaleRate})`, transformOrigin: "top"} : {}} ref={photoContentRef} />
					</Paper>
				</Grid>
				<Grid
					container
					xs={5}
					direction="column"
					justifyContent="space-between"
					alignItems="flex-start"
					style={{maxHeight: props.postAreaHeight * 0.7, flexDirection: "row"}}
				>
					<Grid item style={{width: "100%"}}>
						<Paper
							style={{
								maxHeight: props.postAreaHeight * 0.5,
								padding: "1rem 0.5rem",
								margin: "1rem 0.5rem",
								backgroundColor: "#d0d0d0",
								marginBottom: "2rem",
								overflow: "auto"
							}}
						>
							<p id="tbi-post-text">{contentText}</p>
						</Paper>
					</Grid>
					<Grid container justifyContent="space-evenly" style={{marginBottom: "2rem"}} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						<Grid item xs={4}>
							<Button
								size="large"
								fullWidth
								variant="contained"
								onClick={likePost}
								className={liked ? clsx(classes.btnOrange, classes.btnOrangeEnabled) : classes.btnOrange}
								startIcon={
									liked ? (
										<ThumbUpIcon />
									) : (
										<ThumbUpOutlinedIcon />
									)
								}
							>
								{liked ? "Unlike" : "Like"}
							</Button>
						</Grid>
						<Grid item xs={4}>
							<Button
								size="large"
								fullWidth
								id="goToPost"
								variant="contained"
								className={classes.btnOrange}
								onClick={() => {
									props.setShowFocusMode(false);
									props.scrollToCurrentPost();
								}}
								startIcon={<SendIcon />}
							>
								Go to Post
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Post;
