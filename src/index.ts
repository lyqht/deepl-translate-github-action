import type { TargetLanguageCode } from "deepl-node";
import { Translator } from 'deepl-node';
import path from "path";
import { main } from "./main";

const authKey = process.env.deepl_api_key as string;
const translator = new Translator(authKey);
const inputFilePath = path.join(
	process.env.GITHUB_WORKSPACE as string,
	process.env.input_file_path as string,
);
const outputFileNamePrefix = path.join(
	process.env.GITHUB_WORKSPACE as string,
	process.env.output_file_name_prefix as string,
);
const startTagForNoTranslate = process.env.no_translate_start_tag as string;
const endTagForNoTranslate = process.env.no_translate_end_tag as string;

const tempFilePath = path.join(
	process.env.GITHUB_WORKSPACE as string,
	"to_translate.txt",
);
const fileExtensionsThatAllowForIgnoringBlocks = [".html", ".xml", ".md", ".txt"];

(async () => {
	const targetLanguages =
		process.env.target_languages === "all"
			? (await translator.getTargetLanguages()).map((lang) => lang.code) as TargetLanguageCode[]
			: process.env.target_languages !== undefined
			? (process.env.target_languages?.split(",") as TargetLanguageCode[])
			: [];

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
