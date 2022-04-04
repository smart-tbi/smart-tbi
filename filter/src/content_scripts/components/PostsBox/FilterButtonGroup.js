import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import FilterListIcon from "@material-ui/icons/FilterList";
import Grid from "@material-ui/core/Grid";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import "./FilterButtonGroup.css";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	filterCaption: {
		display: "block",
		textAlign: "center",
		color: "black",
		fontWeight: 800,
		fontSize: "1.2rem",
		margin: "0 1rem",
		textTransform: "none"
	},
	backdrop: {
		zIndex: 100,
		color: "#fff"
	},
	dividerMargin: {
		margin: "0 0.25rem"
	},
	filterGroup: {
		display: "flex",
		flexDirection: "row",
		alignContent: "center",
		alignItems: "center"
	},
	filterButton: {
		color: theme.palette.common.black,
		backgroundColor: inactiveColor,
		"&:hover": {
			backgroundColor: "#e0e0e0"
		}
	},
	filterButtonEnabled: {
		color: theme.palette.common.white,
		backgroundColor: "#ef6c00",
		"&:hover": {
			backgroundColor: "#e0e0e0",
			color: theme.palette.common.black
		}
	}
}));

const activeColor = "#ef6c00";
const inactiveColor = "#ffffff";

/**
 * A set of button groups that shows all filter options
 * 
 * 1. Sort by source (Personal, Group, Page)
 * 2. Sort by type (Link, Image, Video)
 * 3. Sort by positivity (Positive, Neutral, Negative)
 * 4. Change newsfeed order (Default order, Chronological order)
 * 
 */
const FilterButtonGroup = props => {
	const [sortFeedBy, setSortFeedBy] = useState("Default Order");

	const navigateToRecentFeed = () => {
		window.location.assign("https://www.facebook.com/?sk=h_chr");
	};

	const navigateToDefaultFeed = () => {
		window.location.assign("https://www.facebook.com/");
	};

	const currentFeedTypeIdx = () => {
		// returns 0 if feed is sorted by the default order
		// returns 1 if feed is sorted by most recent posts

		if (window.location.href.includes("?sk=h_chr")) {
			return 1;
		} else {
			return 0;
		}
	};

	const classes = useStyles();

	const { postFilter, setPostFilter } = props;

	/** post type filters */

	const postTypeFilters = [
		{
			name: "Personal",
			filterState: props.isFilterEnabled && postFilter.PERSONAL,
			filterSetter: isEnabled => {
				setPostFilter({ PERSONAL: isEnabled });
			}
		},
		{
			name: "Group",
			filterState: props.isFilterEnabled && postFilter.GROUP,
			filterSetter: isEnabled => {
				setPostFilter({ GROUP: isEnabled });
			}
		},
		{
			name: "Page",
			filterState: props.isFilterEnabled && postFilter.PAGE,
			filterSetter: isEnabled => {
				setPostFilter({ PAGE: isEnabled });
			}
		}
	];

	const constructPostTypeFilterButtons = () => {
		let postFilterButtons = [];

		postTypeFilters.forEach(filter => {
			postFilterButtons.push(
				<Button
					className={
						filter.filterState
							? classes.filterButtonEnabled
							: classes.filterButton
					}
					key={filter.name}
					variant={filter.filterState ? "contained" : "outlined"}
					onClick={() => filter.filterSetter(!filter.filterState)}
				>
					{filter.name}
				</Button>
			);
		});

		return postFilterButtons;
	};

	/** post media filters */
	const postMediaFilters = [
		{
			name: "Image",
			filterState: props.isFilterEnabled && postFilter.img,
			filterSetter: isEnabled => {
				setPostFilter({ img: isEnabled });
			}
		},
		{
			name: "Video",
			filterState: props.isFilterEnabled && postFilter.video,
			filterSetter: isEnabled => {
				setPostFilter({ video: isEnabled });
			}
		},
		{
			name: "Link",
			filterState: props.isFilterEnabled && postFilter.externalLink,
			filterSetter: isEnabled => {
				setPostFilter({ externalLink: isEnabled });
			}
		}
	];

	const constructPostMediaFilterButtons = () => {
		let postMediaFilterButtons = [];

		postMediaFilters.forEach(filter => {
			let buttonColor = "";
			let textColor = "";
			if (filter.filterState) {
				buttonColor = activeColor;
				textColor = "#ffffff";
			} else {
				buttonColor = inactiveColor;
				textColor = "#000000";
			}
			postMediaFilterButtons.push(
				<Button
					key={filter.name}
					style={{
						backgroundColor: buttonColor,
						color: textColor
					}}
					variant={filter.filterState ? "contained" : "outlined"}
					onClick={() => filter.filterSetter(!filter.filterState)}
				>
					{filter.name}
				</Button>
			);
		});

		return postMediaFilterButtons;
	};

	/** sentiment filters */
	const postSentimentFilters = [
		{
			name: "Positive",
			filterState: props.isFilterEnabled && postFilter.POSITIVE,
			filterSetter: isEnabled => {
				setPostFilter({ POSITIVE: isEnabled });
			}
		},
		{
			name: "Neutral",
			filterState: props.isFilterEnabled && postFilter.NEUTRAL,
			filterSetter: isEnabled => {
				setPostFilter({ NEUTRAL: isEnabled });
			}
		},
		{
			name: "Negative",
			filterState: props.isFilterEnabled && postFilter.NEGATIVE,
			filterSetter: isEnabled => {
				setPostFilter({ NEGATIVE: isEnabled });
			}
		}
	];

	const constructSentimentFilterButtons = () => {
		let postFilterButtons = [];

		postSentimentFilters.forEach(filter => {
			let buttonColor = "";
			let textColor = "";
			if (filter.filterState) {
				buttonColor = activeColor;
				textColor = "#ffffff";
			} else {
				buttonColor = inactiveColor;
				textColor = "#000000";
			}

			postFilterButtons.push(
				<Button
					key={filter.name}
					style={{
						backgroundColor: buttonColor,
						color: textColor
					}}
					variant={filter.filterState ? "contained" : "outlined"}
					onClick={() => filter.filterSetter(!filter.filterState)}
				>
					{filter.name}
				</Button>
			);
		});

		return postFilterButtons;
	};

	return (
		<Toolbar className="toolbar">
			<div className={classes.filterGroup}>
				<Typography className={classes.filterCaption}>
					Newsfeed Order
				</Typography>
				<Toolbar className="toolbar">
					<FeedSortButton
						currentFeedTypeIdx={currentFeedTypeIdx}
						sortFeedBy={sortFeedBy}
						setSortFeedBy={setSortFeedBy}
						navigateToDefaultFeed={navigateToDefaultFeed}
						navigateToRecentFeed={navigateToRecentFeed}
					/>
				</Toolbar>
			</div>
			<Divider
				style={{ margin: "0 0.5rem" }}
				orientation="vertical"
				flexItem
			/>
			<div className={classes.filterGroup}>
				<Typography className={classes.filterCaption}>
					Filter by source
				</Typography>
				<div className={classes.root}>
					<ButtonGroup color="warning">
						{constructPostTypeFilterButtons()}
					</ButtonGroup>
				</div>
			</div>
			<Divider
				className={classes.dividerMargin}
				orientation="vertical"
				flexItem
			/>
			<div className={classes.filterGroup}>
				<Typography className={classes.filterCaption}>
					by type
				</Typography>
				<div className={classes.root}>
					<ButtonGroup color="warning">
						{constructPostMediaFilterButtons()}
					</ButtonGroup>
				</div>
			</div>
			<Divider
				className={classes.dividerMargin}
				orientation="vertical"
				flexItem
			/>
			<div className={classes.filterGroup}>
				<Typography className={classes.filterCaption}>
					by positivity
				</Typography>
				<div className={classes.root}>
					<ButtonGroup color="warning" backgroundColor="#ffffff">
						{constructSentimentFilterButtons()}
					</ButtonGroup>
				</div>
			</div>
			{/* <Backdrop className={classes.backdrop} open={props.loading}>
				<CircularProgress color="inherit" />
			</Backdrop> */}
		</Toolbar>
	);
};

function FeedSortButton(props) {
	const options = ["Default Order", "Most Recent"];
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	const [selectedIndex, setSelectedIndex] = React.useState(
		props.currentFeedTypeIdx
	);
	const classes = useStyles();

	const handleClick = () => {
		console.info(`You clicked ${options[selectedIndex]}`);
		if (options[selectedIndex] === "Default Order") {
			props.navigateToDefaultFeed();
		} else if (options[selectedIndex] === "Most Recent") {
			props.navigateToRecentFeed();
		}
	};

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setOpen(false);
		if (options[index] === "Default Order") {
			props.navigateToDefaultFeed();
		} else if (options[index] === "Most Recent") {
			props.navigateToRecentFeed();
		}
	};

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	return (
		<Grid alignItems="center">
			<Grid item xs={12}>
				<ButtonGroup variant="contained" ref={anchorRef}>
					<Button
						className={classes.filterButton}
						onClick={handleToggle}
					>
						<FilterListIcon />
						{options[selectedIndex]}
					</Button>
					<Button
						className={classes.filterButton}
						aria-controls={open ? "split-button-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={handleToggle}
					>
						<ArrowDropDownIcon />
					</Button>
				</ButtonGroup>
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === "bottom"
										? "center top"
										: "center bottom"
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList id="split-button-menu">
										{options.map((option, index) => (
											<MenuItem
												key={option}
												disabled={index === 2}
												selected={
													index === selectedIndex
												}
												onClick={event =>
													handleMenuItemClick(
														event,
														index
													)
												}
											>
												{option}
											</MenuItem>
										))}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</Grid>
		</Grid>
	);
}

export default FilterButtonGroup;
