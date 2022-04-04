import React, { useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import BoxContent from "../BoxContent/BoxContent";
import "./HoverBox.css";
import { parsePost } from "../../utils/PostParser";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import LanguageDetect from "languagedetect";
import vaderSentiment from "vader-sentiment";

const lngDetector = new LanguageDetect();

const HoverBox = props => {
	const [posts, setPosts] = useState(null);
	const [structuredPosts, setStructuredPosts] = useState([]);
	const [postsVisibleIndex, setPostsVisibleIndex] = useState(null);
	const [buttonloading, setButtonloading] = useState(null);

	const [postText, setPostText] = useState("");
	const [imageText, setImageText] = useState("");
	const [sentimentText, setSentimentText] = useState("");
	const [sentimentValue, setSentimentValue] = useState(null);
	const [emotionText, setEmotionText] = useState("");
	const [analyzed, setAnalyzed] = useState(false);
	const [postLanguage, setPostLanguage] = useState("");
	const [emptyPostText, setEmptyPostText] = useState(false);
	const [shortPostText, setShortPostText] = useState(false);
	const [errorPostText, setErrorPostText] = useState(false);

	const [toggleHere, setToggleHere] = useState('true');

	useEffect(() => {
		findPosts();
		window.addEventListener("scroll", findPosts);
		return () => {
			window.removeEventListener("scroll", findPosts);
		};
	}, []);

	useEffect(() => {
		// re render your component
		console.log("URL CHANGE");
		setPosts(null);
		setPostText("");
	}, [window.location.href]);

	useEffect(() => {
		chrome.storage.sync.get('toggle', function (toggle) {
			var isTrueSet = (String(toggle.toggle) === 'true');
			if (!isTrueSet) {
				setToggleHere('false');
			} else {
				setToggleHere('true');
			}
		});
	});

	const setHoverPostOnPress = index => {
		console.log("DEBUG setHoverPostOnPress pressed, index: " + index);
		if (posts[index]) {
			let text = findText(posts[index]);
			console.log("DEBUG setHoverPostOnPress findtext" + text);
			let imgTags = posts[index].querySelectorAll("img");
			for (let j = 0; j < imgTags.length; j++) {
				let x = imgTags[j];
				let levels = 0;
				let wrongImage = false;
				while (levels < 10) {
					x = x.parentNode;
					if (x.dir === "auto") {
						wrongImage = true;
						break;
					}
					levels = levels + 1;
				}
				if (!wrongImage) {
					setImageText(imgTags[j].alt);
					break;
				}
			}
			// setHoveredPost(posts[index]);
			console.log("actual setHoverPostOnPress post" + posts[index]);
			setPostText(text);
		}
		return clickSeeMore(index);
	};

	const clickSeeMore = index => {
		if (posts[index]) {
			console.log("hoveredpost was set, hoveredpost: " + posts[index]);
			// eslint-disable-next-line quotes
			let roleButtons = posts[index].querySelectorAll('[role="button"]');
			for (let j = 0; j < roleButtons.length; j++) {
				if (roleButtons[j].innerText === "See more") {
					roleButtons[j].click();
				}
			}
		}
		return new Promise(resolve => {
			setTimeout(() => {
				let text = findText(posts[index]);
				console.log(
					"hoveredpost seemore button was called, full text: " + text
				);
				if (text === "") {
					text = "showNoTextError";
				}
				console.log(
					"hoveredpost seemore button was called, full text: " + text
				);
				setPostText(text);
				resolve(text);
			}, 400);
		});
	};

	const findText = post => {
		let text = "";
		// eslint-disable-next-line quotes
		let textDivs = post.querySelectorAll('[style^="text-align:"]');
		for (let j = 0; j < textDivs.length; j++) {
			if (textDivs[j] && textDivs[j].innerText) {
				let x = textDivs[j];
				let levels = 0;
				let isBlockquote = false;
				let isComment = false;
				while (levels < 15) {
					x = x.parentNode;
					if (x.tagName === "BLOCKQUOTE") {
						isBlockquote = true;
					}
					if (
						x.getAttribute("aria-label") &&
						x
							.getAttribute("aria-label")
							.toLowerCase()
							.includes("comment")
					) {
						isComment = true;
					}
					levels = levels + 1;
				}
				// if (!isBlockquote && !isComment) { uncomment after implementing click 'see original'
				if (!isComment) {
					text += textDivs[j].innerText;
					if (text.slice(-1) === ".") {
						text += " ";
					} else {
						text += ". ";
					}
				}
			}
		}
		return text;
	};

	const findPosts = () => {
		/* eslint quotes: ["off", "double"] */
		let postList = document.querySelectorAll(
			'[data-pagelet^="FeedUnit"], [role="article"]'
		);
		const truePosts = [];
		const parsedPosts = [];
		const truePostsVisibleIndex = [];
		const trueButtonLoadingIndex = [];

		for (let i = 0; i < postList.length; i++) {
			if (postList[i].parentNode.getAttribute("role") === "feed") {
				truePosts.push(postList[i]);
				truePostsVisibleIndex.push(false);
				trueButtonLoadingIndex.push(false);
				continue;
			}
			const deepChild =
				postList[i].firstChild.firstChild.firstChild.firstChild;
			if (
				(deepChild.getAttribute("style") &&
					deepChild
						.getAttribute("style")
						.includes("border-radius: ")) ||
				postList[i].parentNode.getAttribute("role") === "feed"
			) {
				truePosts.push(postList[i]);
				truePostsVisibleIndex.push(false);
				trueButtonLoadingIndex.push(false);
				parsedPosts.push(parsePost(postList[i]));
			}
		}
		console.log("updating findposts main array on screen post" + truePosts);
		console.log("updating visibiltiy main array" + truePostsVisibleIndex);
		setPosts(truePosts);
		setStructuredPosts(parsedPosts);
		setPostsVisibleIndex(truePostsVisibleIndex);
		setButtonloading(trueButtonLoadingIndex);
	};

	const theme = createMuiTheme({
		palette: {
			type: "dark"
		}
	});

	const analyze = (toAnalyze, index) => {
		let detectedLng;

		// detect language of the post
		if (toAnalyze.length > 0) {
			const lngDetectResult = lngDetector.detect(toAnalyze, 1);
			if (lngDetectResult.length > 0) {
				detectedLng = lngDetectResult[0][0];
				setPostLanguage(detectedLng);
			}
		}

		// if the language detected is english, then show the sentiment analysis
		if (detectedLng === "english") {
			// detect sentiment of the post
			const sentimentResult = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(toAnalyze);
			if (sentimentResult.compound >= 0.05) {
				setSentimentText("positive");
			} else if (sentimentResult.compound <= -0.05) {
				setSentimentText("negative");
			} else {
				setSentimentText("neutral");
			}

			setSentimentValue(sentimentResult.compound);
		} else {
			console.log("Non-english post");
		}

		setAnalyzed(true);
		setButtonloading(() => {
			const newArea = buttonloading.map((element, innerIndex) => {
				if (innerIndex === index) {
					return false;
				}
				return element;
			});
			return newArea;
		});
		setPostsVisibleIndex((postsVisibleIndex) => {
			const newArea = postsVisibleIndex.map((element, innerIndex) => {
				if (innerIndex === index) {
					return true;
				}

				return element;
			});

			return newArea;
		});
	};

	const getStrongestEmotion = emotion => {
		const strongestEmotion = { name: "", value: null };
		for (let key of Object.keys(emotion)) {
			if ((strongestEmotion.value === null || emotion[key] > strongestEmotion.value) && emotion[key] > 0.5) {
				strongestEmotion.value = emotion[key];
				strongestEmotion.name = key;
			}
		}
		return strongestEmotion.name;
	};

	return (
		<ThemeProvider theme={theme}>
			{posts
				? posts.length > 0
					? posts.map((post, index) => {
						return (
							<div>
								{postsVisibleIndex[index] && document.body.contains(post) &&
									<Popper
										className="hover-box"
										open={true}
										anchorEl={
											post === null || post === undefined
												? document.body
												: post
										}
										placement="right-start"
										transition
										style={toggleHere === 'true' ? { display: "" } : { display: "none" }}
									>

										{({ TransitionProps }) => (
											<Fade
												{...TransitionProps}
												timeout={200}
											>

												<BoxContent
													closeCallback={() => {
														setPostsVisibleIndex((postsVisibleIndex) => {
															const newArea = postsVisibleIndex.map((element, innerIndex) => {
																if (innerIndex === index) {
																	return false;
																}
																return element;
															});
															return newArea;
														});
													}}
													postText={postText}
													imageText={imageText}
													index={index}
													seeMore={setHoverPostOnPress}
													structuredPost={parsePost(post)}
													sentimentText={sentimentText}
													sentimentValue={sentimentValue}
													emotionText={emotionText}
													analyzed={analyzed}
													postLanguage={postLanguage}
													emptyPostText={emptyPostText}
													shortPostText={shortPostText}
													errorPostText={errorPostText}
												/>
											</Fade>
										)}

									</Popper>
								}

								{!postsVisibleIndex[index] && document.body.contains(post) &&
									<Popper
										className="hover-box"
										open={true}
										anchorEl={
											post === null || post === undefined
												? document.body
												: post
										}
										placement="right-start"
										transition
										style={toggleHere === 'true' ? { display: "" } : { display: "none" }}
									>

										{({ TransitionProps }) => (
											<Fade
												{...TransitionProps}
												timeout={200}
											>
												{buttonloading[index] ? (
													<Button
														variant="contained"
														color="secondary"
														disableElevation
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
														onClick={() => {
															// setLoading(true);
															setButtonloading((buttonloading) => {
																const newArea = buttonloading.map((element, innerIndex) => {
																	if (innerIndex === index) {
																		return true;
																	}
																	return element;
																});
																return newArea;
															});
															setHoverPostOnPress(index).then(toAnalyze => {
																setSentimentText("");
																setSentimentValue(null);
																setEmotionText("");
																setAnalyzed(false);
																setPostLanguage("");
																setEmptyPostText(false);
																setShortPostText(false);
																setErrorPostText(false);
																analyze(toAnalyze, index);
															});
															// setState(postsVisibleIndex.map(element, innerIndex) => if(innerIndex === index){ return true;} return element);
														}}
													>
														ANALYZE
													</Button>
												)}
											</Fade>
										)}

									</Popper>
								}

							</div>


						);
					})
					: 0
				: 0}
		</ThemeProvider >
	);
};

export default HoverBox;
