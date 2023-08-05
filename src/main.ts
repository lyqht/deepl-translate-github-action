import type { TargetLanguageCode, Translator } from "deepl-node";
import fs from "fs";
import path from "path";
import { TranslatedJSONResults, buildOutputFileName, removeKeepTagsFromString, replaceAll, translateRecursive } from "./utils";

interface HTMLlikeParams {
	startTagForNoTranslate?: string;
	endTagForNoTranslate?: string;
}

export interface MainFunctionParams extends HTMLlikeParams {
	translator: Translator;
	inputFilePath: string;
	outputFileNamePattern: string;
	tempFilePath: string;
	fileExtensionsThatAllowForIgnoringBlocks: string[];
	targetLanguages: TargetLanguageCode[];
}

export async function main(params: MainFunctionParams) {
	const {
		translator,
		inputFilePath,
		outputFileNamePattern,
		startTagForNoTranslate,
		endTagForNoTranslate,
		tempFilePath,
		fileExtensionsThatAllowForIgnoringBlocks,
		targetLanguages,
	} = params;
	const fileExtension = path.extname(inputFilePath);
	const isFileHtmlLike =
		fileExtensionsThatAllowForIgnoringBlocks.includes(fileExtension);

	if (isFileHtmlLike) {
		const inputText = fs.readFileSync(inputFilePath, "utf8");
		let textWithNoTranslateTagsReplaced = inputText;
		if (startTagForNoTranslate && endTagForNoTranslate) {
			const textWithNoTranslateStartTagReplaced = replaceAll(
				inputText,
				startTagForNoTranslate,
				"<keep>",
			);
			const textWithNoTranslateEndTagReplaced = replaceAll(
				textWithNoTranslateStartTagReplaced,
				endTagForNoTranslate,
				"</keep>",
			);

			textWithNoTranslateTagsReplaced = textWithNoTranslateEndTagReplaced;
		}

		let textToBeWrittenToTempFile = textWithNoTranslateTagsReplaced;

		console.debug("textToBeWrittenToTempFile: ", textToBeWrittenToTempFile);

		fs.writeFileSync(tempFilePath, textToBeWrittenToTempFile);

		const tempFileExists = fs.existsSync(tempFilePath);
		console.debug("tempFileExists: ", tempFileExists);
		const translateFilePath = tempFileExists ? tempFilePath : inputFilePath;

		fs.readFile(translateFilePath, "utf8", async function (err, text) {
			if (err) {
				return console.info(err);
			}

			console.info(
				`Translating the input file into ${targetLanguages.length} languages...`,
			);

			for (const targetLanguage of targetLanguages) {
				const targetLang = targetLanguage as TargetLanguageCode;
				const textResult = await translator.translateText(
					text,
					null,
					targetLang,
					{
						preserveFormatting: true,
						tagHandling: "xml",
						ignoreTags: ["keep"],
					},
				);

				const translatedText = textResult.text;

				if (translatedText === undefined) {
					console.error(`got undefined translatedText, skipping for ${targetLang}`)
					return
				}
				const resultText = removeKeepTagsFromString(translatedText);

				const outputFileName = buildOutputFileName(targetLang, outputFileNamePattern);
				const outputFolderPath = path.dirname(outputFileName);
				if (!fs.existsSync(outputFolderPath)) {
					fs.mkdirSync(outputFolderPath, { recursive: true });
				}
				fs.writeFile(outputFileName, resultText, function (err) {
					if (err) return console.info(err);
					console.info(`Translated ${targetLang}`);
				});
			}
		});
	} else if (fileExtension === ".json") {
		fs.readFile(inputFilePath, "utf8", async (err, jsonString) => {
			if (err) {
				console.info("Error reading file", err);
				return;
			}

			try {
				const inputJson = JSON.parse(jsonString);
				const translatedRecords = {} as TranslatedJSONResults;
				const translatedResults = await translateRecursive(inputJson, targetLanguages, translator, translatedRecords);

				for (const targetLanguage of targetLanguages) {
					const targetLang = targetLanguage as TargetLanguageCode;
					const outputFileName = buildOutputFileName(targetLang, outputFileNamePattern);
					const resultJson = JSON.stringify(translatedResults[targetLang]);
					const outputFolderPath = path.dirname(outputFileName);
					if (!fs.existsSync(outputFolderPath)) {
						fs.mkdirSync(outputFolderPath, { recursive: true });
					}
					fs.writeFile(outputFileName, resultJson, function (err) {
						if (err) return console.info(err);
						console.info(`Translated ${targetLang}`);
					});
				}
			} catch (err) {
				console.info("Error parsing JSON string", err);
			}
		});
	}
}
