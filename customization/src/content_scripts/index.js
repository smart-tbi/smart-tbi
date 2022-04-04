import React from "react";
import ReactDOM from "react-dom";
import LogDispatcher from "./utils/LogDispatcher";

const logDispatcher = new LogDispatcher("https://3gk7az3cca.execute-api.us-east-1.amazonaws.com/dev/log");

var LeftMenuURLDict = {
    "": "",
    "Find Friends": "friends",
    "Groups": "groups",
    "Marketplace": "marketplace",
    "Watch": "watch",
    "Memories": "onthisday",
    "Pages": "pages",
    "Saved": "saved",
    "News": "news",
    "Events": "events",
    "Favorites": "?sk=favorites",
    "Messenger": "messages/t/",
    "Weather": "weather"
};

setTimeout(() => {
    var displayMode = document.querySelector('meta[name="color-scheme"]').content
    console.log("Is Dark mode")
    console.log(displayMode)
    chrome.storage.local.set({ "displayMode": displayMode });

    // Only Sponsored
    // eslint-disable-next-line quotes
    // let classDivs = document.querySelectorAll('[class="l9j0dhe7"]');
    // let sponsored;
    // for (let node of classDivs) {
    // 	if (node.parentNode.parentNode.parentNode.parentNode.getAttribute("class") === "cxgpxx05") {
    // 		sponsored = node;
    // 		break;
    // 	}
    // }
    // sponsored.setAttribute("style", "display: none");
    { logDispatcher.logEventforTBIClean({ eventType: "Page is refreshed", eventDetail: "-" }) }

    chrome.storage.local.get(["left", "right", "stories", "option1", "option2", "option3", "option4", "option5"], function(res) {
        if (!res.left) {
            // Removing Left Side
            // eslint-disable-next-line quotes
            let leftRail = document.querySelectorAll('[data-pagelet="LeftRail"]')[0];
            leftRail.setAttribute("style", "display: none");
        } else {
            // eslint-disable-next-line quotes
            let leftRail = document.querySelectorAll('[data-pagelet="LeftRail"]')[0];
            // eslint-disable-next-line quotes
            let buttons = leftRail.querySelectorAll('[role="button"]');
            for (let button of buttons) {
                if (button.innerHTML.includes("See more")) {
                    button.click();
                }
            }
            setTimeout(() => {
                // eslint-disable-next-line quotes


                if (res.option1 === "" && res.option2 === "" && res.option3 === "" && res.option4 === "" && res.option5 === "") {} else {
                    leftRail = document.querySelectorAll('[data-pagelet="LeftRail"]')[0];
                    var parentNodee = leftRail.parentNode;

                    leftRail.parentNode.removeChild(leftRail);

                    console.log('parentNode Deleted')
                    const divNode = document.createElement("div");
                    divNode.setAttribute("id", "LeftRail1");
                    divNode.setAttribute("class", displayMode);

                    const listNode = document.createElement("ul");
                    listNode.setAttribute("id", "list1");
                    // const textnode = document.createTextNode("Water");
                    // node.appendChild(textnode);
                    parentNodee.appendChild(divNode);
                    divNode.appendChild(listNode);

                    var ulist = document.getElementById("list1");
                    var newItem1 = document.createElement("li");
                    newItem1.setAttribute("id", "item1");
                    var newItem2 = document.createElement("li");
                    newItem2.setAttribute("id", "item2");
                    var newItem3 = document.createElement("li");
                    newItem3.setAttribute("id", "item3");
                    var newItem4 = document.createElement("li");
                    newItem4.setAttribute("id", "item4");
                    var newItem5 = document.createElement("li");
                    newItem5.setAttribute("id", "item5");
                    var a1 = document.createElement("a");
                    var a2 = document.createElement("a");
                    var a3 = document.createElement("a");
                    var a4 = document.createElement("a");
                    var a5 = document.createElement("a");
                    // var img1 = document.createElement("img");

                    if (res.option1 !== "") {
                        a1.textContent = res.option1;
                        a1.setAttribute('href', "http://www.facebook.com/" + LeftMenuURLDict[res.option1]);
                        a1.setAttribute('alt', "http://www.facebook.com/" + LeftMenuURLDict[res.option1]);
                        a1.setAttribute('title', "http://www.facebook.com/" + LeftMenuURLDict[res.option1]);
                        // img1.setAttribute('src', 'http://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_square-24.png')
                        if (LeftMenuURLDict[res.option1] === '?sk=favorites') {
                            newItem1.setAttribute("class", 'favorites');
                        } else if (LeftMenuURLDict[res.option1] === 'messages/t/') {
                            newItem1.setAttribute("class", 'messenger');
                        } else {
                            newItem1.setAttribute("class", LeftMenuURLDict[res.option1]);
                        }
                        var ListItem1 = document.getElementById("item1");
                        if (typeof(ListItem1) != 'undefined' && ListItem1 != null) {
                            ListItem1.parentNode.removeChild(ListItem1);
                        }
                        // a1.appendChild(img1)
                        newItem1.appendChild(a1);
                        ulist.appendChild(newItem1);
                    } else {
                        var ListItem1 = document.getElementById("item1");
                        if (typeof(ListItem1) != 'undefined' && ListItem1 != null) {
                            ListItem1.parentNode.removeChild(ListItem1);
                        }
                    }

                    if (res.option2 !== "") {
                        a2.textContent = res.option2;
                        a2.setAttribute('href', "http://www.facebook.com/" + LeftMenuURLDict[res.option2]);
                        a2.setAttribute('alt', "http://www.facebook.com/" + LeftMenuURLDict[res.option2]);
                        a2.setAttribute('title', "http://www.facebook.com/" + LeftMenuURLDict[res.option2]);
                        if (LeftMenuURLDict[res.option2] === '?sk=favorites') {
                            newItem2.setAttribute("class", 'favorites');
                        } else if (LeftMenuURLDict[res.option2] === 'messages/t/') {
                            newItem2.setAttribute("class", 'messenger');
                        } else {
                            newItem2.setAttribute("class", LeftMenuURLDict[res.option2]);
                        }
                        var ListItem2 = document.getElementById("item2");
                        if (typeof(ListItem2) != 'undefined' && ListItem2 != null) {
                            ListItem2.parentNode.removeChild(ListItem2);
                        }
                        newItem2.appendChild(a2);
                        ulist.appendChild(newItem2);
                    } else {
                        var ListItem2 = document.getElementById("item2");
                        if (typeof(ListItem2) != 'undefined' && ListItem2 != null) {
                            ListItem2.parentNode.removeChild(ListItem2);
                        }
                    }

                    if (res.option3 !== "") {
                        a3.textContent = res.option3;
                        a3.setAttribute('href', "http://www.facebook.com/" + LeftMenuURLDict[res.option3]);
                        a3.setAttribute('alt', "http://www.facebook.com/" + LeftMenuURLDict[res.option3]);
                        a3.setAttribute('title', "http://www.facebook.com/" + LeftMenuURLDict[res.option3]);
                        if (LeftMenuURLDict[res.option3] === '?sk=favorites') {
                            newItem3.setAttribute("class", 'favorites');
                        } else if (LeftMenuURLDict[res.option3] === 'messages/t/') {
                            newItem3.setAttribute("class", 'messenger');
                        } else {
                            newItem3.setAttribute("class", LeftMenuURLDict[res.option3]);
                        }
                        var ListItem3 = document.getElementById("item3");
                        if (typeof(ListItem3) != 'undefined' && ListItem3 != null) {
                            ListItem3.parentNode.removeChild(ListItem3);
                        }
                        newItem3.appendChild(a3);
                        ulist.appendChild(newItem3);
                    } else {
                        var ListItem3 = document.getElementById("item3");
                        if (typeof(ListItem3) != 'undefined' && ListItem3 != null) {
                            ListItem3.parentNode.removeChild(ListItem3);
                        }
                    }
                    if (res.option4 !== "") {
                        a4.textContent = res.option4;
                        a4.setAttribute('href', "http://www.facebook.com/" + LeftMenuURLDict[res.option4]);
                        a4.setAttribute('alt', "http://www.facebook.com/" + LeftMenuURLDict[res.option4]);
                        a4.setAttribute('title', "http://www.facebook.com/" + LeftMenuURLDict[res.option4]);
                        if (LeftMenuURLDict[res.option4] === '?sk=favorites') {
                            newItem4.setAttribute("class", 'favorites');
                        } else if (LeftMenuURLDict[res.option4] === 'messages/t/') {
                            newItem4.setAttribute("class", 'messenger');
                        } else {
                            newItem4.setAttribute("class", LeftMenuURLDict[res.option4]);
                        }
                        var ListItem4 = document.getElementById("item4");
                        if (typeof(ListItem4) != 'undefined' && ListItem4 != null) {
                            ListItem4.parentNode.removeChild(ListItem4);
                        }
                        newItem4.appendChild(a4);
                        ulist.appendChild(newItem4);
                    } else {
                        var ListItem4 = document.getElementById("item4");
                        if (typeof(ListItem4) != 'undefined' && ListItem4 != null) {
                            ListItem4.parentNode.removeChild(ListItem4);
                        }
                    }
                    if (res.option5 !== "") {
                        a5.textContent = res.option5;
                        a5.setAttribute('href', "http://www.facebook.com/" + LeftMenuURLDict[res.option5]);
                        a5.setAttribute('alt', "http://www.facebook.com/" + LeftMenuURLDict[res.option5]);
                        a5.setAttribute('title', "http://www.facebook.com/" + LeftMenuURLDict[res.option5]);
                        if (LeftMenuURLDict[res.option5] === '?sk=favorites') {
                            newItem5.setAttribute("class", 'favorites');
                        } else if (LeftMenuURLDict[res.option5] === 'messages/t/') {
                            newItem5.setAttribute("class", 'messenger');
                        } else {
                            newItem5.setAttribute("class", LeftMenuURLDict[res.option5]);
                        }
                        var ListItem5 = document.getElementById("item5");
                        if (typeof(ListItem5) != 'undefined' && ListItem5 != null) {
                            ListItem5.parentNode.removeChild(ListItem5);
                        }
                        newItem5.appendChild(a5);
                        ulist.appendChild(newItem5);
                    } else {
                        var ListItem5 = document.getElementById("item5");
                        if (typeof(ListItem5) != 'undefined' && ListItem5 != null) {
                            ListItem5.parentNode.removeChild(ListItem5);
                        }
                    }
                }
                // eslint-disable-next-line quotes
                let buttons = leftRail.querySelectorAll('[role="button"]');
                for (let button of buttons) {
                    if (button.innerHTML.includes("See Less")) {
                        button.setAttribute("style", "display: none");
                    }
                }
            }, 1000);
        }

        if (!res.right) {
            // Removing Right Side
            // eslint-disable-next-line quotes
            let rightRail = document.querySelectorAll('[data-pagelet="RightRail"]')[0];
            rightRail.setAttribute("style", "display: none");
        }

        if (!res.stories) {
            // Removing Stories
            // eslint-disable-next-line quotes
            let stories = document.querySelectorAll('[data-pagelet="Stories"]')[0];
            stories.setAttribute("style", "display: none");
        }
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (
                url.split("/")[2].includes("facebook.com")
            ) {} else {}
        }
    }).observe(document, { subtree: true, childList: true });

    console.log("Content scripts has loaded!");
}, 1000);