import React from "react";
import LabelIcon from "@material-ui/icons/Label";
import Box from "@material-ui/core/Box";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import "./SentimentSlider.css";

const SentimentSlider = props => {
	return (
		<div className="sentiment-slider">
			<div className="slider">
				<LabelIcon className="pointer" fontSize="inherit" style={{marginLeft: `calc(${props.value}*90%)`}}/>
			</div>
			<div className="labels">
				<Box
					display="flex"
					justifyContent="flex-start"
					alignItems="center"
					flexDirection="column"
				>
					<SentimentVeryDissatisfiedIcon
						fontSize="large"
						style={{ color: props.text==="negative" ? "red" : "gray", marginTop: 10, marginRight: 3 }}
					/>
					<p className="subtitle" style={{ ...props.text==="negative" ? {} :  {color: "gray"}, fontSize: "1.1em" }}>Negative</p>
					
				</Box>
				<Box
					display="flex"
					justifyContent="flex-start"
					alignItems="center"
					flexDirection="column"
				>
					<SentimentSatisfiedIcon
						fontSize="large"
						style={{ color: props.text==="neutral" ? "yellow" : "gray", marginTop: 10, marginRight: 3 }}
					/>
					<p className="subtitle" style={{ ...props.text==="neutral" ? {} :  {color: "gray"}, fontSize: "1.1em" }}>Neutral</p>
				</Box>
				<Box
					display="flex"
					justifyContent="flex-start"
					alignItems="center"
					flexDirection="column"
				>
					<SentimentSatisfiedAltIcon
						fontSize="large"
						style={{ color: props.text==="positive" ? "#66ff00" : "gray", marginTop: 10, marginRight: 3 }}
					/>
					<p className="subtitle" style={{ ...props.text==="positive" ? {} :  {color: "gray"}, fontSize: "1.1em" }}>Positive</p>
				</Box>
			</div>
		</div>
	);
};

export default SentimentSlider;
