import * as deepl from "deepl-node";
import path from "path";
import { main } from "../src/main";

const authKey = process.env.deepl_api_key as string;
const translator = new deepl.Translator(authKey);
const playgroundPath = "playground"
const inputFilePath = path.join(playgroundPath, "nested.json");
// note that if outputFileNamePattern is set, outputFileNamePrefix is ignored
const outputFileNamePattern = path.join(playgroundPath, "locales/{language}/nested.json");
const outputFileNamePrefix = path.join(playgroundPath, "translated_simple_");
const startTagForNoTranslate = "<!-- keep -->";
const endTagForNoTranslate = "<!-- /keep -->";

const tempFilePath = path.join(playgroundPath, "to_translate.txt");
const fileExtensionsThatAllowForIgnoringBlocks = [".html", ".xml", ".md", ".txt"];
const targetLanguages = ["ja"] as deepl.TargetLanguageCode[];

(async () => {
	await main({
		translator,
		inputFilePath,
		outputFileNamePattern,
		outputFileNamePrefix,
		startTagForNoTranslate,
		endTagForNoTranslate,
		tempFilePath,
		fileExtensionsThatAllowForIgnoringBlocks,
		targetLanguages,
	});
})();
