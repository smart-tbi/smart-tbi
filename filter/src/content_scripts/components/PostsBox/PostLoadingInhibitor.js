import React from "react";

/**
 * 
 * A component that returns an empty div of height 5000px.
 * When this is appended to the feed element, it will prevent FB from loading more posts.
 * 
 */
export default function PostLoadingInhibitor(props) {
	return <div id="post-loading-inhibitor" style={{ height: "500px" }} />;
}