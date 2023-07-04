import type { TargetLanguageCode, Translator, TextResult } from "deepl-node";
import fs from "fs";
import path from "path";
import { removeKeepTagsFromString, replaceAll } from "./utils";

interface HTMLlikeParams {
	startTagForNoTranslate?: string;
	endTagForNoTranslate?: string;
}

export interface MainFunctionParams extends HTMLlikeParams {
	translator: Translator;
	inputFilePath: string;
	outputFileNamePrefix: string;
	tempFilePath: string;
	fileExtensionsThatAllowForIgnoringBlocks: string[];
	targetLanguages: TargetLanguageCode[];
}

export async function main(params: MainFunctionParams) {
	const {
		translator,
		inputFilePath,
		outputFileNamePrefix,
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

				const outputFileName = `${outputFileNamePrefix}${targetLang}${fileExtension}`;
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
				const keys = Object.keys(inputJson);

				const translatedResults: Partial<
					Record<TargetLanguageCode, Record<string, string>>
				> = {};
				for (const key of keys) {
					const value = inputJson[key] as string;
					const termRegex = /{[^{}]+}/g;
					const textToBeTranslated = value.replace(
						termRegex,
						(match) => `<keep>${match}</keep>`,
					);

					console.info(
						`Translating the input file into ${targetLanguages.length} languages...`,
					);

					for (const targetLanguage of targetLanguages) {
						const targetLang = targetLanguage as TargetLanguageCode;
						const textResult = (await translator.translateText(
							textToBeTranslated,
							null,
							targetLang,
							{
								preserveFormatting: true,
								tagHandling: "xml",
								ignoreTags: ["keep"],
							},
						)) as TextResult;

						if (!translatedResults[targetLang]) {
							translatedResults[targetLang] = {};
						}

						const translatedText = textResult.text;
						const resultText = removeKeepTagsFromString(translatedText);
						translatedResults[targetLang]![key] = resultText;
					}
				}

				for (const targetLanguage of targetLanguages) {
					const targetLang = targetLanguage as TargetLanguageCode;
					const outputFileName = `${outputFileNamePrefix}${targetLang}${fileExtension}`;
					const resultJson = JSON.stringify(translatedResults[targetLang]);
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
