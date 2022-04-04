import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./HoverButton.css";

const HoverButton = props => {
	return (
		<ThemeProvider>
			<Button
				variant="contained"
				color="secondary"
				disableElevation
				style={{ margin: "0 auto", marginTop: 15 }}
			>
				ANALYZE
			</Button>
		</ThemeProvider>
	);
};

export default HoverButton;
