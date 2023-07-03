import * as deepl from "deepl-node";
import path from "path";
import { main } from "./main";

const authKey = process.env.deepl_api_key as string;
const translator = new deepl.Translator(authKey);
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

const tempFilePath = path.join(process.env.GITHUB_WORKSPACE as string, "to_translate.txt");
const fileExtensionsThatAllowForIgnoringBlocks = [".html", ".xml", ".md"];

(async () => {await main({
	translator,
	inputFilePath,
	outputFileNamePrefix,
	startTagForNoTranslate,
	endTagForNoTranslate,
	tempFilePath,
	fileExtensionsThatAllowForIgnoringBlocks,
})})
