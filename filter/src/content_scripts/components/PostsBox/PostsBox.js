/* eslint-disable */
import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import NoPostAlert from "./NoPostAlert";
import { parsePost } from "../../utils/PostParser";
import "./PostsBox.css";

const PostsBox = props => {
	const [postDOMs, setPostDOMs] = useState([]); // array of post HTML elements
	const [parsedPosts, setParsedPosts] = useState([]); // array of posts in a structured, reusable JSON format
	const [filteredPostIndices, setFilteredPostIndices] = useState([]); // array of indices of filtered posts
	const [numPostDOMs, setNumPostDOMs] = useState(0);
	const [lastParsedPostIdx, setLastParsedPostIdx] = useState(-1);

	const {postFilter} = props; // get filter settings passed from the bottom bar

	/**
	 * On first load of extension, 
	 */
	useEffect(() => {
		if(sessionStorage.getItem("filter_initial_load") === "true") {
			// If this is not the first load of the extension, do nothing
		}

		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 500);
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 1000);

		setTimeout(() => {
			findPosts();
			window.scrollTo({
				top: 0,
			})
			sessionStorage.setItem("filter_initial_load", true);
		}, 1500)
		
	}, []);


	useEffect(
		() => {
			let numFilteredPosts = filteredPostIndices.length;
			let numRenderedFilteredPosts = document.querySelectorAll("div.filtered").length;
			console.log("filtered length: "+ document.querySelectorAll("div.filtered").length);

			if (numFilteredPosts !== numRenderedFilteredPosts) {
				props.setLoading(true);
			} else {
				props.setLoading(false);
			}
		},
		[document.querySelectorAll("div.filtered").length, filteredPostIndices.length]
	);

	/**
	 * Shows the loading spinner while the extension parses the DOMs of posts
	 */
	useEffect(
		() => {
			console.log(`postDOMS: ${numPostDOMs} | posts: ${parsedPosts.length}`);
			
			if (numPostDOMs !== parsedPosts.length) {
				props.setLoading(true);
			} else {
				props.setLoading(false);
			}
		},
		[parsedPosts.length, numPostDOMs]
	)

	useEffect(
		() => {
			MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

			var observer = new MutationObserver(function(mutations, observer) {
			  // fired when a mutation occurs
			  console.log("article length: " + document.querySelectorAll('div[role="article"]').length);
			  setNumPostDOMs(document.querySelectorAll('div[role="article"]').length);
			  findPosts();
			  // ...
			});
			// define what element should be observed by the observer
			// and what types of mutations trigger the callback
			observer.observe(document.querySelector('div[role="feed"]'), {
			  subtree: true,
			  childList: true
			});
		}, []
	)

	const isFilterSelected = () => {
		return postFilter.PERSONAL || postFilter.GROUP || postFilter.PAGE || postFilter.POSITIVE || postFilter.NEGATIVE || postFilter.NEUTRAL || postFilter.externalLink || postFilter.img || postFilter.video;
	}

	/** 
	 * Filter posts based on the filter settings
	*/
	useEffect(
		() => {
			if (!props.isFilterEnabled){
				showFilteredFeed([...Array(postDOMs.length).keys()])
				return;
			}

			props.setLoading(true);

			findPosts();

			let filteredStructuredPosts = [...parsedPosts];

			if (postFilter.PERSONAL){
				// Get personal posts
				let personalPosts = parsedPosts.filter(post => {
					return post.isPerson === true;
				});

				filteredStructuredPosts = personalPosts;
			}

			else if (postFilter.GROUP){
				// Get posts from groups
				let groupPosts = parsedPosts.filter(post => {
					return post.type === "GROUP";
				});

				filteredStructuredPosts = groupPosts;
			}

			else if (postFilter.PAGE) {
				// Get posts from pages
				let pagePosts = parsedPosts.filter(post => {
					return post.type === "PAGE";
				})

				filteredStructuredPosts = pagePosts;
			}

			else if (postFilter.POSITIVE) {
				// Get posts with positive sentiment
				let positivePosts = parsedPosts.filter(post => {
					if (post.sentiment === undefined) {
						return false;
					}

					return post.sentiment.compound >= 0.05; 
				})

				filteredStructuredPosts = positivePosts;
			}

			else if (postFilter.NEGATIVE) {
				// Get posts with negative sentiment
				let negativePosts = parsedPosts.filter(post => {
					if (post.sentiment === undefined) {
						return false;
					}

					return post.sentiment.compound <= -0.05; 
				})

				filteredStructuredPosts = negativePosts;
			}

			else if (postFilter.NEUTRAL) {
				// Get posts with neutral sentiment
				let neutralPosts = parsedPosts.filter(post => {
					if (post.sentiment === undefined) {
						return false;
					}

					return post.sentiment.compound !== 0 && -0.05 < post.sentiment.compound && post.sentiment.compound < 0.05;
				})

				filteredStructuredPosts = neutralPosts;
			}

			else if (postFilter.externalLink) {
				// Get posts with external links
				let linkPosts = parsedPosts.filter(post => {
					if (post.externalLink === undefined) {
						return false;
					} else {
						return true;
					}
				})

				filteredStructuredPosts = linkPosts;
			}

			else if (postFilter.img) {
				// Get posts with images
				let imgPosts = parsedPosts.filter(post => {
					if (post.img === undefined) {
						return false;
					} else {
						return true;
					}
				})

				filteredStructuredPosts = imgPosts;
			}

			else if (postFilter.video) {
				// Get posts with videos
				let videoPosts = parsedPosts.filter(post => {
					if (post.containsVideo) {
						return true;
					} else {
						return false;
					}
				})

				filteredStructuredPosts = videoPosts;
			} else {
				filteredStructuredPosts = [...parsedPosts]
			}

			let filteredIndices = [];
			filteredStructuredPosts.forEach(post => {
				filteredIndices.push(post.idx);
			});
			console.log("filteredIndices: ");
			console.log(filteredIndices);

			if (isFilterSelected() && filteredIndices.length <= 6) {
				ReactDOM.render(<NoPostAlert numFilteredPosts={filteredIndices.length} numPostDOMs={numPostDOMs} filteredPostIndices={filteredPostIndices}/>, document.getElementById("tbi-filter-alert-area"));
				console.log("no result after filtering!");

			} else {
				ReactDOM.render(null, document.getElementById("tbi-filter-alert-area"));
			}

			setFilteredPostIndices(filteredIndices);
			showFilteredFeed(filteredIndices);

			props.setLoading(false);
		},
		[
			props.isFilterEnabled,
			postFilter.PERSONAL,
			postFilter.GROUP,
			postFilter.PAGE,
			postFilter.POSITIVE,
			postFilter.NEGATIVE,
			postFilter.NEUTRAL,
			postFilter.externalLink,
			postFilter.img,
			postFilter.video,
			parsedPosts.length
		]
	);

	// Only show the filtered posts by manipulating the post DOMs in the feed
	const showFilteredFeed = (filteredIndices) => {
		props.setLoading(true);
		let postIndicesToFilter = [...filteredIndices];

		// filter out non-posts, such as comments (real posts do not have aria-label)
		let articles = document.querySelectorAll("[role='article']"); 

		if (parsedPosts.length === 0 || postDOMs.length !== parsedPosts.length) {
			// props.setLoading(false);
			return;
		};

		for (let i=0; i < postDOMs.length; i++) {
			let actualIdx = parsedPosts[i].elementIdx;
			
			const ariaLabel = articles[actualIdx].getAttribute("aria-label");

			if (i === postIndicesToFilter[0]) {
				if (!ariaLabel) {
					articles[actualIdx].classList.add("filtered");
					articles[actualIdx].classList.remove("hide");
				}
				postIndicesToFilter.shift();
			} else {
				articles[actualIdx].classList.add("hide");
				articles[actualIdx].classList.remove("filtered");
			}
		}
		props.setLoading(false);

	}

	/**
	 * Iterate over the article DOM elements,
	 * add article elements that are actually posts,
	 * parse them into structured format, and store them in the states
	 */
	const findPosts = () => {
		// eslint-disable-next-line quotes
		const postList = [...postDOMs];
		const parsedPostList = [...parsedPosts];

		const allPosts = document.querySelectorAll('[role="article"]'); // All article DOMs in the feed
		let startIdx = lastParsedPostIdx + 1;

		for (let i = startIdx; i < allPosts.length; i++) {
			// Only add newly loaded posts
			if (
				allPosts[i].getAttribute("aria-label") !== null &&
				allPosts[i].getAttribute("aria-label").startsWith("Comment")
			) {
				continue;
			}

			if (
				allPosts[i].textContent.includes("was tagged.") ||
				allPosts[i].textContent.includes("liked a post.") ||
				allPosts[i].textContent
					.toLowerCase()
					.includes("suggested for you") ||
				allPosts[i].textContent.includes(" commented.") ||
				allPosts[i].textContent.includes("People You May Know") ||
				allPosts[i].textContent.includes("shared a memory.")
			) {
				continue;
			}

			if (
				allPosts[i].querySelectorAll("h5").length === 2
			) {
				// ignore shared post
				continue;
			}

			// 1. Deep copy new post DOMs from the feed
			let newPostDOM = allPosts[
				i
			].firstChild.firstChild.firstChild.cloneNode(true);
			postList.push(newPostDOM);

			// 2. Parse posts into a structured format
			let parsed = parsePost(newPostDOM);
			parsed.idx = postList.length - 1;
			parsed.elementIdx = i;
			parsedPostList.push(parsed);
			allPosts[i].setAttribute("data-tbi-post", JSON.stringify(parsed));
		}

		// 3. Store 1 and 2 in state!
		setPostDOMs(postList);
		setParsedPosts(parsedPostList);
		setLastParsedPostIdx(allPosts.length-1);
	};

	return <></>
};

export default PostsBox;
