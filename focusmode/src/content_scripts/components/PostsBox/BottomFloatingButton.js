import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import CenterFocusWeakIcon from "@material-ui/icons/CenterFocusWeak";
import { orange } from "@material-ui/core/colors";
import Zoom from "@material-ui/core/Zoom";

const BottomFloatingButton = props => {
	const useStyles = makeStyles(theme => ({
		fabContainer: {
			zIndex: 1500,
			bottom: 0,
			position: "fixed",
			left: "50%",
			transform: "translate(-50%,0)"
		},
		extendedIcon: {
			marginRight: theme.spacing(1)
		},
		fabOrange: {
			textTransform: "capitalize",
			fontWeight: 800,
			margin: theme.spacing(1),
			borderRadius: "16px",
			color: theme.palette.common.white,
			backgroundColor: orange[700],
			"&:hover": {
				backgroundColor: orange[900]
			}
		},
		fabOrangeEnabled: {
			backgroundColor: orange[900],
			"&:hover": {
				backgroundColor: orange[700]
			}
		}
	}));

	const classes = useStyles();

	const toggleFocusMode = () => {
		if (props.showFocusMode) {
			props.setShowFocusMode(false);
		} else {
			props.setShowFocusMode(true);
		}
	};

	return (
		<div className={classes.fabContainer}>
			<Zoom in={true} timeout={300} unmountOnExit>
				<Fab
					variant="extended"
					color="primary"
					aria-label="add"
					className={
						props.showFocusMode
							? clsx(classes.fabOrange, classes.fabOrangeEnabled)
							: classes.fabOrange
					}
					onClick={() => toggleFocusMode()}
				>
					<CenterFocusWeakIcon className={classes.extendedIcon} />
					{props.showFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
				</Fab>
			</Zoom>
		</div>
	);
};

export default BottomFloatingButton;
