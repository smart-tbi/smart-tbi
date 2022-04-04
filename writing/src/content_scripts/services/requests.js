import textgears from "textgears-api";
import { Client } from "@conversationai/perspectiveapi-js-client";
import { PERSPECTIVE_API_KEY, TEXTGEAR_API_KEY } from "../../api-keys";

export const textgearsChecker = (toCheck) => {
	const textgearsApi = textgears(TEXTGEAR_API_KEY, {language: "en-US"});
	return textgearsApi.checkGrammar(toCheck);
};

export const perspectiveApi = (toCheck) => {
	const client = new Client(PERSPECTIVE_API_KEY);
	return client.getScores(toCheck, {attributes: ["TOXICITY", "SEVERE_TOXICITY", "IDENTITY_ATTACK", "INSULT", "PROFANITY", "THREAT", "OBSCENE", "SPAM"]});
};
