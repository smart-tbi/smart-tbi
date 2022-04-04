import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import FilterButtonGroup from "./FilterButtonGroup";
import "./BottomFloatingBar.css";

const BottomFloatingBar = props => {
	const useStyles = makeStyles(theme => ({
		fabButton: {
			position: "absolute",
			zIndex: 1,
			width: "32px",
			height: "32px",
			left: 0,
			right: 0,
			margin: "0 auto"
		},
		filterCaption: {
			display: "block",
			textAlign: "center",
			color: "black", 
			fontWeight: 800,
			fontSize: "1.5rem",
			margin: "0 1rem",
			textTransform: "none",
		},
	}));

	const classes = useStyles();
	const {postFilter, setPostFilter} = props;

	return (
		<AppBar id="bottom-floating-bar" style={{backgroundColor: "#94A4B8", padding: "1.5rem 0", alignItems:"center", display: props.show ? "flex" : "none" }} position="static">
			<FilterButtonGroup
				postFilter={postFilter}
				setPostFilter={setPostFilter}
				isFilterEnabled={props.isFilterEnabled}
				loading={props.loading}
			/>
		</AppBar>
	);
};

export default BottomFloatingBar;
