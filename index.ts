import * as deepl from "deepl-node";
import fs from "fs";
import path from "path";

const authKey = process.env.deepl_api_key as string;
const translator = new deepl.Translator(authKey);
const targetLanguages = process.env.target_languages?.split(",") as string[];
const inputFilePath = path.join(
	process.env.GITHUB_WORKSPACE as string,
	process.env.input_file_path as string,
);
const outputFileNamePrefix = path.join(
	process.env.GITHUB_WORKSPACE as string,
	process.env.output_file_name_prefix as string,
);
const termsToIgnoreForTranslation =
	process.env.ignore_terms?.split(",") || ([] as string[]);
const startTagForNoTranslate = process.env.no_translate_start_tag as string;
const endTagForNoTranslate = process.env.no_translate_end_tag as string;

const tempFilePath = "to_translate.txt";
const fileExtensionsThatAllowForIgnoringBlocks = [".html", ".xml", ".md"];

function replaceAll(str: string, search: string, replacement: string): string {
	let index = str.indexOf(search);
	while (index != -1) {
		str = str.replace(search, replacement);
		index = str.indexOf(search);
	}
	return str;
}

// main
(async () => {
	const fileExtension = path.extname(inputFilePath);
	const isFileHtmlLike =
		fileExtensionsThatAllowForIgnoringBlocks.includes(fileExtension);

	if (isFileHtmlLike) {
		fs.readFile(inputFilePath, "utf8", async function (err, text) {
			if (err) {
				return console.log(err);
			}

            if (termsToIgnoreForTranslation.length > 0) {

                termsToIgnoreForTranslation.forEach((term) => {
                    text = text.replace(new RegExp(term, "g"), `<keep>${term}</keep>`);
                });

                const textWithNoTranslateStartTagReplaced = replaceAll(
                    text,
                    startTagForNoTranslate,
                    "<keep>",
                );
                const textWithNoTranslateEndTagReplaced = replaceAll(
                    textWithNoTranslateStartTagReplaced,
                    endTagForNoTranslate,
                    "</keep>",
                );
                fs.writeFile(
                    tempFilePath,
                    textWithNoTranslateEndTagReplaced,
                    function (err) {
                        if (err) return console.log(err);
                        console.log(`Created file to be translated`);
                    },
                );
            }

		});

		const tempFileExists = fs.existsSync(tempFilePath);
		const translateFilePath = tempFileExists ? tempFilePath : inputFilePath;

		console.log(
			`Translating the input file into ${targetLanguages.length} languages...`,
		);

		fs.readFile(translateFilePath, "utf8", async function (err, text) {
			if (err) {
				return console.log(err);
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

				// remove added keep tags
				const textWithNoTranslateStartTagReplaced = replaceAll(
					translatedText,
					"<keep>",
					"",
				);
				const textWithNoTranslateEndTagReplaced = replaceAll(
					textWithNoTranslateStartTagReplaced,
					"</keep>",
					"",
				);

                const outputFileName = `${outputFileNamePrefix}${targetLang}.${fileExtension}`;
				fs.writeFile(
					outputFileName,
					textWithNoTranslateEndTagReplaced,
					function (err) {
						if (err) return console.log(err);
						console.log(`Translated ${targetLang}`);
					},
				);
			}
		});
	} else if (fileExtension === ".json") {
		fs.readFile(inputFilePath, "utf8", async (err, jsonString) => {
			if (err) {
				console.log("Error reading file", err);
				return;
			}

			try {
				const inputJson = JSON.parse(jsonString);
				const keys = Object.keys(inputJson);

                const translatedResults: Partial<Record<deepl.TargetLanguageCode, Record<string, string>>> = {}
				for (const key of keys) {
					const value = inputJson[key];

                    console.log(
                        `Translating the input file into ${targetLanguages.length} languages...`,
                    );

					for (const targetLanguage of targetLanguages) {
						const targetLang = targetLanguage as deepl.TargetLanguageCode;
						const textResult = await translator.translateText(
							value,
							null,
							targetLang,
						) as deepl.TextResult;

                        if (!translatedResults[targetLang]) {
                            translatedResults[targetLang] = {};
                        }
                        translatedResults[targetLang]![key] = textResult.text;
					}
				}

                for (const targetLanguage of targetLanguages) {
					const targetLang = targetLanguage as deepl.TargetLanguageCode;
                    const outputFileName = `${outputFileNamePrefix}${targetLang}.${fileExtension}`;
                    const resultJson = JSON.stringify(translatedResults[targetLang]);
                    fs.writeFile(
                        outputFileName,
                        resultJson,
                        function (err) {
                            if (err) return console.log(err);
                            console.log(`Translated ${targetLang}`);
                        },
                    );
                }

			} catch (err) {
				console.log("Error parsing JSON string", err);
			}
		});
	}
})();
