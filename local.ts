import * as deepl from "deepl-node";
import path from "path";
import { main } from "./main";

const authKey = "your_auth_key_here";
const translator = new deepl.Translator(authKey);
const inputFilePath = "/your/input/file/path/here";
const outputFileNamePrefix = "/your/output/file/name/prefix/here";
const startTagForNoTranslate = "your_start_tag_here";
const endTagForNoTranslate = "your_end_tag_here";

const tempFilePath = path.join("/your/temp/file/path/here", "to_translate.txt");
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
