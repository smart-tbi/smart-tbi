
/* eslint-disable */ 
import nlp from "compromise"
import vaderSentiment from "vader-sentiment"

/**
 * Parses Facebook Post as an HTML element and
 * returns it as an object
 * 
 * @param {Object} postHTMLElement 
 */

var result = {}

export const parsePost = postHTMLElement => {
    result = {}

    findAllAriaLabels(postHTMLElement);
    findAllLinkRoles(postHTMLElement);
    findPostText(postHTMLElement);
    findMedia(postHTMLElement);
    checkIfSponsored(postHTMLElement);
    getSentimentAnalysis();

    return result;
}

const getSentimentAnalysis = () => {
    if (result.text) {
        let intensity = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(result.text);
        result.sentiment = intensity;
    }

}

const findAllLinkRoles = node => {
    let nodes = node.querySelectorAll("[role='link']");
  
    Array.from(nodes).forEach(node => {
        if (node.querySelector("strong")) {
            result.name = node.innerText;

            if (result.shareSetting && result.shareSetting.toLowerCase() === "verified account") {
                // if it's verified, the account probably is not a human (rather a page, organization, etc)
                result.verified = true;
                result.type = "PAGE";
                result.isPerson = false;
            } else if (result.name.split(" ").length > 3) {
                // if the name has more than 3 words, most likely it's not a human name...
                result.isPerson = false;
            } else {
                let doc = nlp(result.name);
                if (doc.has("#Person")) {
                    // if compromise detects any Person Name entity, let's assume it's a human name
                    result.isPerson = true;
                } else {
                    result.isPerson = false;
                }
                result.type = "PERSONAL"
            }
        } else if (node.querySelector("a > b")){
          result.name = node.innerText;
          let groupName = node.querySelector("a > span");
          if (groupName !== null) {
            result.groupName = groupName;
          }
          result.type = "GROUP"
        } else if (node.getAttribute("target") === "_blank") {  // External Link
        if (!result.externalLink) {
            result.externalLink = node.innerText      
        }
        }
    })

    if (result.type === "GROUP") {
        let groupName = node.querySelector("a > span")?.innerText;
        result.groupName = groupName;
    }
  }

const findAllAriaLabels = node => {
    let nodes = node.querySelectorAll("[aria-label]");
    
    Array.from(nodes).forEach(node => {
        if (node.style.height == "12px") {
            result.shareSetting = node.ariaLabel;
        } else if (node.ariaLabel.slice(0,5) === "Like:") {
                    result.likeCount = node.ariaLabel.match( /\d+/g )[0]; 
        }
    })
    
}

/**
 * 
 * Find images and videos in a post
 * 
 * @param {HTMLElement} node 
 */
const findMedia = node => {
    const images = node.querySelectorAll("img");
    const video = node.querySelector("video");

    if (video) {
        result.containsVideo = true;
        return;
    } else {
        result.containsVideo = false;
    }

    if (images.length == 0) {
        // no media
        return;
    }

    const realImages = Array.from(images).filter(image => {
        // filter out images that are not real images (e.g. emojis, like icons)
        return !image.src.includes("emoji") && Number(image.getAttribute("width")) > 24;
    })

    let i = 0;

    if (realImages.length > 0) {
        result.img = realImages[0].getAttribute("src")
        result.imgAlt = realImages[0].getAttribute("alt")
    }
}

const findPostText = node => {
    let text = "";
    let done = false;

    // Rule 1
    try {
	    text = node.querySelector('a[role="link"]').parentNode.parentNode.parentNode.parentNode.nextSibling.firstChild.innerText
        done = true;
    } catch (error) {
        // console.log("Error parsing post text using rule2");
    }

    // Rule 2
    if (!done) {
        try {
            text = node.querySelector('a[role="link"]').parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.innerText;
        } catch (error) {
            // console.log("Error parsing post text using rule2");
        }    
    }

	result.text = text;
}

const checkIfSponsored = node => {
    let flag = false;

    if (node.querySelector("a[href^='/ad']") !== null){
        flag = true;
    } else if (node.querySelector("a[aria-label='Sponsored']")){
        flag = true;
    } else if (node.querySelector("a[aria-label='Advertiser link']")){
        flag = true;
    } else if (node.querySelector("span[aria-label='Sponsored']")){
        flag = true;
    }
    if (flag) {
        result.type = "SPONSORED"
    }
}