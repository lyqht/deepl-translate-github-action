import * as deepl from "deepl-node";
import path from "path";
import { main } from "../src/main";

const authKey = process.env.deepl_api_key as string;
const translator = new deepl.Translator(authKey);
const inputFilePath = "playground/nested.json";
const outputFileNamePrefix = "playground/";
const startTagForNoTranslate = "<!-- keep -->";
const endTagForNoTranslate = "<!-- /keep -->";

const tempFilePath = path.join(outputFileNamePrefix, "to_translate.txt");
const fileExtensionsThatAllowForIgnoringBlocks = [".html", ".xml", ".md", ".txt"];
const targetLanguages = ["ja"] as deepl.TargetLanguageCode[];

(async () => {
	await main({
		translator,
		inputFilePath,
		outputFileNamePrefix,
		startTagForNoTranslate,
		endTagForNoTranslate,
		tempFilePath,
		fileExtensionsThatAllowForIgnoringBlocks,
		targetLanguages,
	});
})();
