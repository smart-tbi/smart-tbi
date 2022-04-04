/* eslint-disable */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import CircularProgress from '@material-ui/core/CircularProgress';
import PostLoadingInhibitor from "./PostLoadingInhibitor";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2)
		}
	},
	preventPostLoading: {
		height: "5000px"
	},
	bottomBarOffset: {
		height: "300px"
	},
    loadingTimeoutWarning: {
        marginTop: "0.5rem"
    },
	warningContained: {
		backgroundColor: "#ff9800",
		color: theme.palette.warning.contrastText,
		"&:hover":{
			backgroundColor: theme.palette.warning.dark
		},
		"&:disabled":{
			backgroundColor: theme.palette.warning.light
		},
		marginTop: "0.5rem"
	},
	warningOutlined: {
		marginTop: "0.5rem",
		borderColor: "#663c00",
		color: "#663c00",
	}
}));

export default function NoPostAlert(props) {
	const classes = useStyles();
	const [shouldLoadMorePosts, setShouldLoadMorePosts] = useState(false);
	const [timerStartTime, setTimerStartTime] = useState(null);

	const removeLoadingInhibitors = () => {
		while (document.querySelector("div.post-loading-inhibitor") !== null) {
			document.querySelector("div.post-loading-inhibitor").classList.remove("post-loading-inhibitor");
		}
	}

	useEffect(() => {
		if (shouldLoadMorePosts && props.numFilteredPosts >= 1) {
			removeLoadingInhibitors();
		} else if (!shouldLoadMorePosts && props.numFilteredPosts >= 1) {
			clearInterval(postLoadingTimer);
			let filteredPosts = document.querySelectorAll("div.filtered");
			if (!filteredPosts[filteredPosts.length-1].classList.contains("post-loading-inhibitor")) {
				removeLoadingInhibitors();
				filteredPosts[filteredPosts.length-1].classList.add("post-loading-inhibitor");
			}
		}
	}, [shouldLoadMorePosts, props.numFilteredPosts])

	const getSecondsDiff = (time1, time2) => {
		if (time1 === null) {
			return 0;
		}

		let diff = time2.getTime() - time1.getTime();

		return Math.round(diff / 1000);
	}
    
	var postLoadingTimer = undefined;

	const getAlertTitle = () => {
		if (props.numFilteredPosts === 0) {
			return (
				<>
					<AlertTitle>No Matches Found</AlertTitle>
					We could not find posts that match your filter based on the
					current feed. Try loading more posts to see any matching posts.
				</>
			)
		} else {
			return (
				<>
					<AlertTitle>Too few posts</AlertTitle>
					We need at least 6 posts in the filtered result for a stable experience. 
					Try loading more posts to see any matching posts.
				</>
			)
		}
	}

	const preventPostLoading = () => {
		if (!shouldLoadMorePosts && props.numFilteredPosts === 0) {
			return <PostLoadingInhibitor />
		}
	}

	

	return (
		<div className={classes.root}>
			<Alert severity="warning">
				{getAlertTitle()}
				<br />
				<Button
                    className={shouldLoadMorePosts ? classes.warningContained : classes.warningOutlined}
                    variant="outlined"
					onClick={() => {
                        clearInterval(postLoadingTimer);
						setShouldLoadMorePosts(!shouldLoadMorePosts);
						setTimeout(() => {
-							setShouldLoadMorePosts(false);
							clearInterval(postLoadingTimer);
						}, 60000);
						setTimerStartTime(new Date());
					}}
					color="warning"
					size="medium"
					startIcon={shouldLoadMorePosts && <CircularProgress size={14} />}
				>
					{shouldLoadMorePosts
						? `Stop loading more posts (${props.numFilteredPosts} / ${props.numPostDOMs})`
						: "Load more posts"}
				</Button>
				{shouldLoadMorePosts && <div className={classes.loadingTimeoutWarning}>
                    <strong>
                        Loading will stop automatically after {60 - getSecondsDiff(timerStartTime, new Date())} seconds to prevent
                        your account from being rate-limited by Facebook. Keep scrolling to the bottom of the page to load more posts.
                    </strong>
                </div> }
			</Alert>

			{preventPostLoading()}

			{props.numFilteredPosts === 0 && (
				<div className={classes.bottomBarOffset} />
			)}

		</div>
	);
}
