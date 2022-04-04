
/* eslint-disable */ 
import nlp from "compromise" // named entity detection
import vaderSentiment from "vader-sentiment"
import * as chrono from 'chrono-node'; // natural language date parser

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
    findImage(postHTMLElement);
    findProfileImg(postHTMLElement);
    findVideo(postHTMLElement);
    checkIfSponsored(postHTMLElement);
    getSentimentAnalysis();
    findDateTime(postHTMLElement);

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

const findDateTime = node => {
    let dateTime;

    if (result.type === "GROUP") {
        dateTime = node.querySelectorAll("b")[1]?.innerText?.replaceAll("-", "");
    } else {
        dateTime = node.querySelector("b")?.innerText?.replaceAll("-", "");
    }

    if (!dateTime) return;

    if (dateTime.toLowerCase() === "sponsored") {
        result.datetime = "";
    } else {
        result.datetime = parseFacebookTimestamp(dateTime)?.toISOString();
    }

    return;
}

/**
 * Facebook's timestamp is in human-readable format (e.g. "2 hrs" "Just now")
 * This function parses the natural language timestamp and returns it as a Date object
 * 
 * @param {String} timestamp
 */
const parseFacebookTimestamp = timestamp => {
    const time = timestamp.split(" ");
    const suffix = time.at(-1);

    const suffixes = ["hrs", "hr", "min", "mins"]

    if (suffix === "now") {
        return new Date();
    } else if (suffixes.includes(suffix)) {
        timestamp += " ago";
    } 

    return chrono.parseDate(timestamp);    
}

const findImage = node => {
    let images = node.querySelectorAll("img");

    if (images.length == 0) {
        // no image
        return;
    }

    let i = 0;
    // emojis are inserted as <img>, so exclude those
    while (!images[i].src.includes("emoji")){
        if (i !== images.length-1) {
            i++;
        } else {
            break;
        }
    }

    if (images[i] !== null) {
        result.img = images[i].getAttribute("src")
        result.imgAlt = images[i].getAttribute("alt")
    }
}


const findProfileImg = node => {
    if (result.type === "GROUP") {
        result.profileImg = node.querySelectorAll("image")[1]?.getAttribute("xlink:href")
        result.groupProfileImg = node.querySelectorAll("image")[0]?.getAttribute("xlink:href")
    } else {
        let profileImg = node.querySelector("image")?.getAttribute("xlink:href");
        result.profileImg = profileImg;
    }
}

const findVideo = node => {
    let video = node.querySelector("video");

    if (video) {
        result.containsVideo = true;
    } else {
        result.containsVideo = false;
    }
}

const findPostText = node => {
    let text = Array.from(node.querySelectorAll("div[dir='auto']")).map(e=>e.innerText).join("\n")

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