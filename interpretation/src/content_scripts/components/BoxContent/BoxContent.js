import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import SentimentSlider from "../SentimentSlider/SentimentSlider";
import "./BoxContent.css";

const BoxContent = props => {
	return (
		<div className="box-content-outer">
			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="flex-end"
				flexDirection="column"
			>
				<IconButton
					style={{ marginTop: -9, marginRight: -10 }}
					onClick={props.closeCallback}
				>
					<CloseIcon />
				</IconButton>
			</Box>

			<p className="caption">Image Info:</p>
			<p className="subtitle" style={{ fontSize: "1.25em" }}>{props.imageText === "" ? <b>No info found</b> : props.imageText}</p>
			<br></br>

			<Box
				display="flex"
				justifyContent="flex-start"
				alignItems="flex-start"
				flexDirection="column"
			>
				{props.analyzed ? (
					props.shortPostText ? (
						<React.Fragment>
							<p className="caption">
								The post text is very short to analyze
							</p>
						</React.Fragment>
					) : props.errorPostText ? (
						<React.Fragment>
							<p className="caption">
								Sorry! This text cannot be analyzed
							</p>
						</React.Fragment>
					) : props.postLanguage === "english" ? (
						props.emptyPostText ? (
							<React.Fragment>
								<p className="caption">No text to analyze</p>
							</React.Fragment>
						) : (
							<div className="box-content">
								<React.Fragment>
									<p className="caption">Sentiment:</p>
									<SentimentSlider
										value={props.sentimentValue}
										text={props.sentimentText}
									/>
								</React.Fragment>
							</div>
						)
					) : (
						<React.Fragment>
							<p className="caption">
								The post language is not english
							</p>
						</React.Fragment>
					)
				) : ""
					// : loading ? (
					// 	<Button
					// 		variant="contained"
					// 		color="secondary"
					// 		disableElevation
					// 		style={{ margin: -15 }}
					// 	>
					// 		<CircularProgress
					// 			size={20}
					// 			style={{
					// 				margin: 2,
					// 				marginLeft: 30,
					// 				marginRight: 30
					// 			}}
					// 		/>
					// 	</Button>
					// ) : (
					// 	<Button
					// 		variant="contained"
					// 		color="secondary"
					// 		disableElevation
					// 		onClick={() => {
					// 			setLoading(true);
					// 			props.seeMore(props.index).then(toAnalyze => {
					// 				analyze(toAnalyze);
					// 			});
					// 		}}
					// 		style={{ margin: -15 }}
					// 	>
					// 		ANALYZE
					// 	</Button>
					// )
				}
			</Box>
			{/* : (<Box
				display="flex"
				justifyContent="flex-start"
				alignItems="flex-start"
				flexDirection="column"
				>
					<React.Fragment>
						<p className="caption">The post language is not english</p>
					</React.Fragment>
				</Box>)} */}
		</div>
	);
};

export default BoxContent;
