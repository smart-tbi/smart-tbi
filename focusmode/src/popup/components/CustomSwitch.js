import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function CustomSwitch(props) {
	return (
		<FormGroup>
			<FormControlLabel
				style={{ justifyContent: "center", margin: "0px" }}
				control={<IOSSwitch {...props} />}
			/>
		</FormGroup>
	);
}

// iOS Switch style adapted from https://v4.mui.com/components/switches/#switch
const IOSSwitch = withStyles(theme => ({
	root: {
		width: "80px",
		height: "40px",
		padding: "0px"
	},
	switchBase: {
		color: "#818181",
		padding: "1px",
		"&$checked": {
			"& + $track": {
				backgroundColor: "#23bf58"
			}
		}
	},
	thumb: {
		color: "white",
		width: "36px",
		height: "36px",
		margin: "1px"
	},
	track: {
		borderRadius: "20px",
		backgroundColor: "#818181",
		opacity: "1 !important",
		"&:after, &:before": {
			color: "white",
			fontSize: "14px",
			position: "absolute",
			top: "12px"
		},
		"&:after": {
			content: "'ON'",
			left: "10px"
		},
		"&:before": {
			content: "'OFF'",
			right: "9px"
		}
	},
	checked: {
		color: "#23bf58 !important",
		transform: "translateX(40px) !important"
	},
	focusVisible: {}
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked
			}}
			{...props}
		/>
	);
});
