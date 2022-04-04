import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {
	perspectiveApi,
	textgearsChecker
} from "../../services/requests";
import vaderSentiment from "vader-sentiment";
import SentimentSlider from "../SentimentSlider/SentimentSlider";
import "./BoxContent.css";
import alex from "alex";

const BoxContent = props => {
	const [saveInitialDraft, setSaveInitialDraft] = useState(false);

	const [sentimentText, setSentimentText] = useState("");
	const [sentimentValue, setSentimentValue] = useState(null);

	const [realGrammarErrorsLength, setRealGrammarErrorsLength] = useState(0);
	const [grammarErrors, setGrammarErrors] = useState([]);
	const [profanityErrors, setProfanityErrors] = useState([]);
	const [warningLabels, setWarningLabels] = useState([]);

	const [isGrammarAnalyzed, setIsGrammarAnalyzed] = useState(false);
	const [isWarningAnalyzed, setIsWarningAnalyzed] = useState(false);

	const [isGrammarAnalysisLoading, setIsGrammarAnalysisLoading] = useState(
		false
	);
	const [isWarningAnalysisLoading, setIsWarningAnalysisLoading] = useState(
		false
	);

	const [isSummaryAnalysisLoading, setIsSummaryAnalysisLoading] = useState(
		false
	);

	const [isReCheckButtonDisabled, setIsReCheckButtonDisabled] = useState(
		true
	);

	const [analyzed, setAnalyzed] = useState(false);

	useEffect(
		() => {
			if (props.activePageIndex === 1) {
				if (props.inputText !== "" && props.inputText !== "\n") {
					setIsGrammarAnalysisLoading(true);
					setRealGrammarErrorsLength(0);
					grammarCheck(props.inputText, false);
				}
				setIsGrammarAnalyzed(true);
			} else if (props.activePageIndex === 2) {
				if (props.inputText !== "" && props.inputText !== "\n") {
					setIsWarningAnalysisLoading(true);
					profanityCheck(props.inputText, false);
				}
				setIsWarningAnalyzed(true);
			} else if (props.activePageIndex === 3) {
				if (props.inputText !== "" && props.inputText !== "\n") {
					setAnalyzed(false);
					analyze(props.inputText, false);
				}
			} else if (props.activePageIndex === 4) {
				props.updatePublicText(false);
			} else if (props.activePageIndex === 5) {
				if (props.inputText !== "" && props.inputText !== "\n") {
					setIsSummaryAnalysisLoading(true);
					setRealGrammarErrorsLength(0);
					grammarCheck(props.inputText, true);
					profanityCheck(props.inputText, true);
					setAnalyzed(false);

					analyze(props.inputText, true);
					props.updatePublicText(true);

					setTimeout(() => {
						console.log("World!");
					}, 2000);

					setIsGrammarAnalyzed(true);
					setIsWarningAnalyzed(true);
					setIsSummaryAnalysisLoading(false);
				}
			}
		},
		[props.activePageIndex]
	);

	useEffect(
		() => {
			const handleProps = () => {
				if (props.inputText) {
					setIsReCheckButtonDisabled(false);
				} else {
					console.log("InputText is empty");
				}
			};

			handleProps();
			return () => {
				handleProps();
			};
		},
		[props.inputText]
	);

	const analyze = (toAnalyze, isSummary) => {
		// detect sentiment of the post
		const sentimentResult = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(
			toAnalyze
		);
		if (sentimentResult.compound >= 0.05) {
			setSentimentText("positive");
		} else if (sentimentResult.compound <= -0.05) {
			setSentimentText("negative");
		} else {
			setSentimentText("neutral");
		}

		setSentimentValue(sentimentResult.compound);

		setAnalyzed(true);
		setIsReCheckButtonDisabled(true);

		var headerText = isSummary
			? "Summary - 3. Emotion and Sentiment Check"
			: "3. Emotion and Sentiment Check";

		// ibmAnalyze(toAnalyze)
		// 	.then(response => {
		// 		console.log(response.data.result);
		// 		setEmotionText(getStrongestEmotion(response.data.result.emotion ? response.data.result.emotion.document.emotion : ""));
		// 		setSentimentText(response.data.result.sentiment ? response.data.result.sentiment.document.label : "");
		// 		setSentimentValue(response.data.result.sentiment ? response.data.result.sentiment.document.score : null);

		// 		var headerText = isSummary ? "Summary - 3. Emotion and Sentiment Check" : "3. Emotion and Sentiment Check";

		// 	})
		// 	.catch(error => {
		// 		setIsEmotionAnalysisLoading(false);
		// 		console.log(error.response)
		// 		console.log(error.message)
		// 		setEmotionErrorText(error.message);
		// 		setIsReCheckButtonDisabled(true)
		// 		console.error(error);
		// 		var headerText = isSummary ? "Summary - 3. Emotion and Sentiment Check" : "3. Emotion and Sentiment Check";
		// 	});
	};

	const grammarCheck = (toCheck, isSummary) => {
		textgearsChecker(toCheck)
			.then(data => {
				var errorCount = 0;
				console.log(data);
				data.response.errors.map(error =>
					error.better.length > 0
						? setRealGrammarErrorsLength(realGrammarErrorsLength => realGrammarErrorsLength + 1) : null
				);
				data.response.errors.map(error =>
					error.better.length > 0 ? errorCount++ : null
				);
				setGrammarErrors(data.response.errors);
				setIsGrammarAnalysisLoading(false);
				setIsReCheckButtonDisabled(true);

				var headerText = isSummary
					? "Summary - 1. Grammar and Spelling Check"
					: "1. Grammar and Spelling Check";
			})
			.catch(err => {
				setIsGrammarAnalysisLoading(false);

				var headerText = isSummary
					? "Summary - 1. Grammar and Spelling Check"
					: "1. Grammar and Spelling Check";
				console.log(err);
			});
	};

	const profanityCheck = (toCheck, isSummary) => {
		perspectiveApi(toCheck)
			.then(data => {
				console.log(data);
				const labels = [];
				for (let label of Object.keys(data)) {
					if (data[label] > 0.9) {
						label = label.replace("_", " ");
						labels.push(
							label[0] +
								label.slice(1, label.length).toLowerCase()
						);
					}
				}
				console.log(labels);
				setWarningLabels(labels);
				const errors = alex.text(toCheck).messages;
				console.log(errors);
				setProfanityErrors(errors);
				setIsWarningAnalysisLoading(false);
				setIsReCheckButtonDisabled(true);

				var headerText = isSummary
					? "Summary - 2. Toxicity Check"
					: "2. Toxicity Check";
			})
			.catch(err => {
				setIsWarningAnalysisLoading(false);

				var headerText = isSummary
					? "Summary - 2. Toxicity Check"
					: "2. Toxicity Check";
				console.log(err);
			});
	};

	return (
		<div className="box-content">
			{/* Introduction page */}
			{props.activePageIndex === 0 && (
				<>
					<p className="subtitle">
						Writing feedback helps you write clearer and appealing
						messages. This system helps you monitor the following
						aspects of your writing in turns. <br />• Step 1:
						Grammar and Spelling Check<br />• Step 2: Toxicity Check
						<br />• Step 3: Emotion and Sentiment Check<br />• Step
						4: Privacy Setting Check<br />
						When you finish drafting, click the button below
					</p>
				</>
			)}

			{/* Grammar and spelling check page */}
			{props.activePageIndex === 1 && (
				<>
					{/* Save initial draft to local browser databse */}
					{!saveInitialDraft &&
						props.inputText !== "" &&
						props.inputText !== "\n" && (
							<>
								{localStorage.setItem(
									"initialDraft",
									props.inputText
								)}
								{setSaveInitialDraft(true)}
							</>
					)}

					{/* No grammar errors from API */}
					{isGrammarAnalyzed &&
						(grammarErrors.length === 0 ||
							realGrammarErrorsLength === 0) && (
							<>
								<p className="subtitle">
									Everything looks good!<br />
								</p>
							</>
					)}

					{/* Show grammar errors along with suggestions */}
					{isGrammarAnalyzed &&
						grammarErrors.length !== 0 &&
						realGrammarErrorsLength !== 0 && (
							<>
								<p className="subtitle">
									There{" "}
									{realGrammarErrorsLength === 1
										? "is"
										: "are"}{" "}
									{realGrammarErrorsLength} grammar/spelling{" "}
									{realGrammarErrorsLength === 1
										? "error"
										: "errors"}{" "}
									that you can consider rewriting..
								</p>
								{grammarErrors.map(error =>
									error.better.length > 0 ? (
										<p
											key={error.id}
											className="captionSummary"
										>
											{`${
												error.bad
											} → ${error.better.join(", ")}`}
										</p>
									) : null
								)}
							</>
					)}

					{/* Show Re-Analyze Grammar button */}
					{isGrammarAnalyzed && (
						<>
							<Box
								display="flex"
								justifyContent="flex-start"
								alignItems="flex-start"
								flexDirection="column"
							>
								{isGrammarAnalysisLoading ? (
									<Button
										variant="contained"
										color="secondary"
										disableElevation
										style={{
											margin: "0 auto",
											marginTop: 15
										}}
									>
										<CircularProgress
											size={20}
											style={{
												margin: 2,
												marginLeft: 30,
												marginRight: 30
											}}
										/>
									</Button>
								) : (
									<Button
										float="bottom"
										variant="contained"
										color="secondary"
										disableElevation
										disabled={
											(grammarErrors.length === 0 ||
												realGrammarErrorsLength ===
													0) &&
											isReCheckButtonDisabled
										}
										{...(props.inputText !== "" &&
										props.inputText !== "\n"
											? {
												onClick: () => {
													setIsGrammarAnalysisLoading(
														true
													);
													setRealGrammarErrorsLength(
														0
													);
													grammarCheck(
														props.inputText,
														false
													);
												}
											}
											: {})}
										style={{
											margin: "0 auto",
											marginTop: 15
										}}
									>
										Re-Analyze Grammar
									</Button>
								)}
							</Box>
						</>
					)}
				</>
			)}

			{/* Toxicity check page */}
			{props.activePageIndex === 2 && isWarningAnalyzed && (
				<>
					{/* No toxicity warning errors from API */}
					{warningLabels.length === 0 && (
						<>
							<p className="subtitle">
								Everything looks good!<br />
							</p>
						</>
					)}

					{/* Show toxicity warning errors */}
					{warningLabels.length !== 0 && (
						<>
							<p className="subtitle">
								Your message may include..
							</p>
							<p className="captionSummary">
								{warningLabels.join(", ")}
							</p>
						</>
					)}

					{/* Show toxicity warning suggestions */}
					{warningLabels.length !== 0 &&
						profanityErrors.length !== 0 && (
							<>
								{profanityErrors.map((error, index) =>
									error.message.length !== 0 ? (
										<p
											key={index}
											className="caption"
										>{`• ${error.message}`}</p>
									) : null
								)}
							</>
					)}

					{/* Show Re-Analyze Toxicity button */}
					<Box
						display="flex"
						justifyContent="flex-start"
						alignItems="flex-start"
						flexDirection="column"
					>
						{isWarningAnalysisLoading ? (
							<Button
								variant="contained"
								color="secondary"
								disableElevation
								style={{ margin: "0 auto", marginTop: 15 }}
							>
								<CircularProgress
									size={20}
									style={{
										margin: 2,
										marginLeft: 30,
										marginRight: 30
									}}
								/>
							</Button>
						) : (
							<Button
								variant="contained"
								color="secondary"
								disableElevation
								disabled={
									warningLabels.length === 0 &&
									isReCheckButtonDisabled
								}
								{...(props.inputText !== "" &&
								props.inputText !== "\n"
									? {
										onClick: () => {
											setIsWarningAnalysisLoading(
												true
											);
											profanityCheck(
												props.inputText,
												false
											);
										}
									}	
									: {})}
								style={{ margin: "0 auto", marginTop: 15 }}
							>
								Re-Analyze Toxicity
							</Button>
						)}
					</Box>
				</>
			)}

			{/* Sentiment check page */}
			{props.activePageIndex === 3 && (
				<>
					{/* Show generic error if anything goes wrong in IBM API call
					{isEmotionAnalyzed &&
						emotionText.length === 0 &&
						emotionErrorText.length !== 0 && (
							<>
								<p className="subtitle">
									Sorry!<br />
									There was an error in getting the "Emotion
									and Sentiment" information.<br />
								</p>
							</>
						)} */}

					{/* No emotion and sentiment errors from API */}
					{props.inputText === "" &&
						props.inputText === "\n" && (
							<>
								<p className="subtitle">
									Everything looks good!<br />
								</p>
							</>
					)}

					{/* Show sentiment information */}
					{analyzed && (
						<>
							<Box
								display="flex"
								justifyContent="flex-start"
								alignItems="flex-start"
								flexDirection="column"
							>
								<React.Fragment>
									<p className="subtitle">
										Your message may sound..
									</p>
									<p className="captionSummary">Sentiment:</p>
									<SentimentSlider
										value={sentimentValue}
										text={sentimentText}
									/>
								</React.Fragment>
							</Box>
						</>
					)}
				</>
			)}

			{/* Privacy setting check page */}
			{props.publicText !== "" &&
				props.publicText !== "\n" &&
				props.activePageIndex === 4 && (
					<>
						{/* Show privacy setting information */}
						<p className="subtitle">Your privacy setting is..</p>
						<p className="captionSummary">{props.publicText}</p>

						{/* Show Re-Check privacy setting button */}
						<Box
							display="flex"
							justifyContent="flex-start"
							alignItems="flex-start"
							flexDirection="column"
						>
							<Button
								variant="contained"
								color="secondary"
								disableElevation
								onClick={() => {
									props.updatePublicText(false);
								}}
								style={{ margin: "0 auto", marginTop: 15 }}
							>
								Re-Check
							</Button>
						</Box>
					</>
			)}

			{/* Summary page */}
			{props.activePageIndex === 5 && (
				<>
					{/* No grammar errors from API inside summary page */}
					{isGrammarAnalyzed &&
						(grammarErrors.length === 0 ||
							realGrammarErrorsLength === 0) && (
							<>
								<p className="subtitle">Grammar & Spelling:</p>
								<p className="captionSummary">
									Everything looks good!
								</p>
								<br />
							</>
					)}

					{/* Show grammar errors along with suggestions inside summary page */}
					{isGrammarAnalyzed &&
						grammarErrors.length !== 0 &&
						realGrammarErrorsLength !== 0 && (
							<>
								<p className="subtitle">Grammar & Spelling:</p>
								<p className="captionSummary">
									There{" "}
									{realGrammarErrorsLength === 1
										? "is"
										: "are"}{" "}
									{realGrammarErrorsLength} grammar/spelling{" "}
									{realGrammarErrorsLength === 1
										? "error"
										: "errors"}{" "}
									that you can consider rewriting.
								</p>
								<br />
							</>
					)}

					{/* No toxicity warning errors from API inside summary page */}
					{isWarningAnalyzed && warningLabels.length === 0 && (
						<>
							<p className="subtitle">Toxicity:</p>
							<p className="captionSummary">
								Everything looks good!
							</p>
							<br />
						</>
					)}

					{/* Show toxicity warning errors inside summary page */}
					{isWarningAnalyzed && warningLabels.length !== 0 && (
						<>
							<p className="subtitle">Toxicity:</p>
							<p className="captionSummary">
								Your message may include..
							</p>
							<p className="caption">
								{warningLabels.join(", ")}
							</p>
							{isWarningAnalyzed &&
								warningLabels.length !== 0 &&
								profanityErrors.length !== 0 ? ("") : (	<br />)}
						</>
					)}

					{/* Show toxicity warning suggestions inside summary page */}
					{isWarningAnalyzed &&
						warningLabels.length !== 0 &&
						profanityErrors.length !== 0 && (
							<>
								{profanityErrors.map((error, index) =>
									error.message.length !== 0 ? (
										<p
											key={index}
											className="caption"
										>{`• ${error.message}`}</p>
									) : null
								)}
								<br />
							</>
					)}
{/* 
					Show generic error if anything goes wrong in IBM API call inside summary page
					{isEmotionAnalyzed &&
						emotionText.length === 0 &&
						emotionErrorText.length !== 0 && (
							<>
								<p className="subtitle">
									Emotion and Sentiment:
								</p>
								<p className="captionSummary">
									Sorry!<br />
									There was an error in getting the "Emotion
									ans Sentiment" information.
								</p>
								<br />
							</>
						)}

					No sentiment errors from API inside summary page
					{isEmotionAnalyzed &&
						props.inputText === "" &&
						props.inputText === "\n" &&
						emotionErrorText.length === 0 && (
							<>
								<p className="subtitle">
									Emotion and Sentiment:
								</p>
								<p className="captionSummary">
									Everything looks good!
								</p>
								<br />
							</>
						)} */}

					{/* Show emotion and sentiment information inside summary page */}
					{analyzed && (
						<>
							<p className="subtitle">Sentiment:</p>
							<p className="captionSummary">
								Your message may sound..
							</p>
							<p className="caption">
								Sentiment:{" "}
								{sentimentText.charAt(0).toUpperCase() +
									sentimentText.slice(1)}
							</p>
							<br />
						</>
					)}

					{/* Show privacy setting information inside summary page */}
					{props.publicText !== "" && props.publicText !== "\n" && (
						<>
							<p className="subtitle">Privacy Setting:</p>
							<p className="captionSummary">
								Your privacy setting is..
							</p>
							<p className="caption">{props.publicText}</p>
						</>
					)}
				</>
			)}

			{/* Text evolution page */}
			{props.activePageIndex === 6 && (
				<>
					{/* If there is no initial draft in browser database, show "Everything looks good!" */}
					{localStorage.getItem("initialDraft") === null && (
						<>
							<p className="subtitle">
								Everything looks good, nothing to show!
							</p>
						</>
					)}

					{/* Text evolution is displayed ("Initial draft saved in the browser database" -> "current text in the inputBox") */}
					{localStorage.getItem("initialDraft") !== null &&
						props.inputText !== "" &&
						props.inputText !== "\n" && (
							<>
								<p className="subtitle">
									Hurray, you did it! 😀{" "}
								</p>
								<p className="subtitle">
									You have improved your writing quite a lot.
									Here's a look at how far you have come..
								</p>
								<br />
								<p className="captionSummary">
									{localStorage.getItem("initialDraft")}
									<br />→ <br />
									{props.inputText}
								</p>
								<br />
							</>
					)}
				</>
			)}
		</div>
	);
};

export default BoxContent;
