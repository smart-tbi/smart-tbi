import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";

const fpPromise = FingerprintJS.load();

/**
 * LogDispatcher class is responsible for sending logs to the server.
 * 
 * Example Usage:
 * 
 * // initialize LogDispatcher
 * const logDispatcher = new LogDispatcher("https://b361k35he6.execute-api.us-east-1.amazonaws.com/logs");
 * 
 * // send log to server with event_type and event_detail.
 * // log_id, user_id, session_id, and timestamp will be automatically generated.
 * logDispatcher.logGeneralEvent("BUTTON_CLICK", "clicked like button");
 * 
 * // send log to server with a custom object
 * // log_id, user_id, session_id, and timestamp will be automatically generated.
 * logDispatcher.logCustomEvent(
 *  {"custom_field": "CUSTOM_FIELD", "remarks": "blah blah blah"}
 * );
 * 
 */
export default class LogDispatcher {
	constructor(apiUrl) {
		this.apiUrl = apiUrl;

		// Initialize the user id
		this.userId = sessionStorage.getItem("tbi-user-id") || "";
		if (!this.userId) {
			fpPromise
				.then(fp => fp.get())
				.then(result => {
					const userId = result.visitorId;
					this.userId = userId;
					sessionStorage.setItem("tbi-user-id", userId);
					console.log(
						`LogDispatcher has been created! user_id: ${this.userId
						}`
					);
				});
		}

		// Initialize the session id
		this.sessionCounter = 0;
		this.sessionId = this.generateSequentialUuid();
	}

	/**
	 * A private function to generate a sequential UUID
	 *
	 * @returns a sequential UUID
	 */
	generateSequentialUuid() {
		return uuidv1({
			clockseq: this.sessionCounter++
		}); // This will generate a sequential UUID
	}

	/**
	 * Updates the session id of the LogDispatcher by generating a new sequential UUID
	 *
	 */
	updateSessionId() {
		this.sessionId = this.generateSequentialUuid();
	}

	/**
	 * Get a template log object filled with essential data (app name, datetime, user_id, and session_id)
	 *
	 * @returns {Object} a template object for a log
	 */
	getLogDataTemplate() {
		let logData = {};
		logData["log_id"] = uuidv4();
		logData["user_id"] = this.userId;
		logData["session_id"] = this.sessionId;
		logData["timestamp"] = new Date().toISOString();

		return logData;
	}

	/**
	 *
	 * Send a log object to the server. Essential fields are automatically added.
	 *
	 * @param {Object} logData
	 */

	sendLog(logData) {
		Object.assign(logData, this.getLogDataTemplate()); // add the essential data
		console.log(logData)
		fetch(this.apiUrl, {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(logData)
		}).then(response => response.json())
		.then(data => console.log(data));
	}

	/**
	 `* Log a general event FOR TBI-WRITING-LOGS with event_type, event_detail, activePage, inputText
	 *
	 * @param {String} eventType
	 * @param {String} eventDetail
	 * @param {String} activePage
	 * @param {String} inputText
	 */
	logEventforTBIWriting(logInfo) {
		let logData = {};
		logData["event_type"] = logInfo.eventType;
		logData["event_detail"] = logInfo.eventDetail;
		logData["active_page"] = logInfo.activePage;
		logData["input_text"] = logInfo.inputText;
		this.sendLog(logData);
	}

	/**
	 `* Log a general event FOR TBI-CLEAN-LOGS with event_type, event_detail
	 *
	 * @param {String} eventType
	 * @param {String} eventDetail
	 * @param {String} activePage
	 * @param {String} inputText
	 */
	 logEventforTBIClean(logInfo) {
		let logData = {};
		logData["event_type"] = logInfo.eventType;
		logData["event_detail"] = logInfo.eventDetail;
		this.sendLog(logData);
	}

	logEventforTBICleanApplyButton(logInfo) {
		let logData = {};
		logData["event_type"] = logInfo.eventType;
		logData["event_detail"] = logInfo.eventDetail;
		logData["left_button"] = logInfo.leftButton;
		logData["option1_button"] = logInfo.option1Type;
		logData["option2_button"] = logInfo.option2Type;
		logData["option3_button"] = logInfo.option3Type;
		logData["option4_button"] = logInfo.option4Type;
		logData["option5_button"] = logInfo.option5Type;
		logData["right_button"] = logInfo.rightButton;
		logData["stories_button"] = logInfo.storiesButton;

		this.sendLog(logData);
	}

	/**
	 * Log a general event with event_type, event_detail, and post (optional)
	 *
	 * @param {String} eventType
	 * @param {String} eventDetail
	 */
	logGeneralEvent(eventType, eventDetail, post = {}) {
		let logData = {};
		logData["event_type"] = eventType;
		logData["event_detail"] = eventDetail;
		logData["post"] = JSON.stringify(this.getAnonymizedPost(post));

		this.sendLog(logData);
	}

	/**
	 * Log a custom event
	 *
	 * @param {Object} customData
	 */
	logCustomEvent(customData) {
		this.sendLog(customData);
	}

	/**
	 *
	 * Log a button click event
	 *
	 * @param {String} buttonName
	 * @param {Object} post
	 */
	logButtonClick(buttonName, post = {}) {
		let logData = {};
		logData["event_type"] = "CLICK_BUTTON";
		logData["event_detail"] = buttonName;
		logData["post"] = JSON.stringify(this.getAnonymizedPost(post));

		this.sendLog(logData);
	}

	getAnonymizedPost(post) {

	}

	/**
	 * Log a post view event
	 *
	 * @param {Object} post
	 */
	logPostView(post) {
		let logData = {};

		logData["event_type"] = "VIEW_POST";
		logData["post"] = JSON.stringify(this.getAnonymizedPost(post));
		logData["event_detail"] = "";

		this.sendLog(logData);
	}

	/**
	 * Log time spent in a post view event
	 *
	 * @param {String} seconds
	 */
	logPostViewTime(seconds, post) {
		let logData = {};

		logData["event_type"] = "VIEW_POST_TIME_SPENT";
		logData["event_detail"] = `${seconds} sec`;
		logData["post"] = JSON.stringify(this.getAnonymizedPost(post));

		this.sendLog(logData);
	}
}
