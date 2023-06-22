import * as deepl from "deepl-node";
import fs from "fs";
import path from "path";
import { removeKeepTagsFromString, replaceAll } from "./utils";

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

// main
(async () => {
	const targetLanguages =
	process.env.target_languages === "all"
		? (await translator.getTargetLanguages()).map((lang) => lang.code)
		: process.env.target_languages !== undefined
		? (process.env.target_languages?.split(",") as string[])
		: [];
		
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

		console.debug("textToBeWrittenToTempFile: ", textToBeWrittenToTempFile)

		fs.writeFileSync(tempFilePath, textToBeWrittenToTempFile);

		const tempFileExists = fs.existsSync(tempFilePath);
		console.debug("tempFileExists: ", tempFileExists)
		const translateFilePath = tempFileExists ? tempFilePath : inputFilePath;

		console.info(
			`Translating the input file into ${targetLanguages.length} languages...`,
		);

		fs.readFile(translateFilePath, "utf8", async function (err, text) {
			if (err) {
				return console.info(err);
			}

			for (const targetLanguage of targetLanguages) {
				const targetLang = targetLanguage as deepl.TargetLanguageCode;
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
					Record<deepl.TargetLanguageCode, Record<string, string>>
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
						const targetLang = targetLanguage as deepl.TargetLanguageCode;
						const textResult = (await translator.translateText(
							textToBeTranslated,
							null,
							targetLang,
							{
								preserveFormatting: true,
								tagHandling: "xml",
								ignoreTags: ["keep"],
							},
						)) as deepl.TextResult;

						if (!translatedResults[targetLang]) {
							translatedResults[targetLang] = {};
						}

						const translatedText = textResult.text;
						const resultText = removeKeepTagsFromString(translatedText);
						translatedResults[targetLang]![key] = resultText;
					}
				}

				for (const targetLanguage of targetLanguages) {
					const targetLang = targetLanguage as deepl.TargetLanguageCode;
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
})();
