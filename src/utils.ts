import type { TargetLanguageCode, Translator, TextResult } from "deepl-node";

function replaceAll(str: string, search: string, replacement: string): string {
	let index = str.indexOf(search);
	while (index != -1) {
		str = str.replace(search, replacement);
		index = str.indexOf(search);
	}
	return str;
}

function replaceParameterStringsInJSONValueWithKeepTags(value: string): string {
	const termRegex = /({{.*?}}|{.*?})/g;
	return value.replace(termRegex, (match) => `<keep>${match}</keep>`);
}

function removeKeepTagsFromString(str: string): string {
	if (!str.includes("<keep>")) return str;

	const textWithNoTranslateStartTagReplaced = replaceAll(str, "<keep>", "");
	const textWithNoTranslateEndTagReplaced = replaceAll(
		textWithNoTranslateStartTagReplaced,
		"</keep>",
		"",
	);
	return textWithNoTranslateEndTagReplaced;
}

type PossibleRecursive<T> = {
	[K in keyof T]: T[K] extends object ? PossibleRecursive<T[K]> : T[K];
};

type TranslatedJSONResults = Record<
	TargetLanguageCode,
	PossibleRecursive<Record<string, string>>
>;

export const applyRecursive = async (
	inputJson: Record<string, any>,
	path: string[] = [],
	operation: Function,
	operationArgs: any[],
) => {
	const keys = Object.keys(inputJson);

	for (const key of keys) {
		const newPath = [...path, key];

		if (typeof inputJson[key] === "object") {
			await applyRecursive(inputJson[key], newPath, operation, operationArgs);
		} else {
			await operation(inputJson[key], newPath, ...operationArgs);
		}
	}
};

const translateRecursive = async (
	inputJson: Record<string, any>,
	targetLanguages: TargetLanguageCode[],
	translator: Translator,
	translatedResults: TranslatedJSONResults,
) => {
	const translate = async (
		value: string,
		path: string[],
		targetLanguages: TargetLanguageCode[],
		translator: Translator,
		translatedResults: TranslatedJSONResults,
	) => {
		const textToBeTranslated =
			replaceParameterStringsInJSONValueWithKeepTags(value);

		for (const targetLanguage of targetLanguages) {
			const textResult = (await translator.translateText(
				textToBeTranslated,
				null,
				targetLanguage,
				{
					preserveFormatting: true,
					tagHandling: "xml",
					ignoreTags: ["keep"],
				},
			)) as TextResult;

			if (!translatedResults[targetLanguage]) {
				translatedResults[targetLanguage] = {};
			}

			const translatedText = textResult.text;
			const resultText = removeKeepTagsFromString(translatedText);

			// Assign the translated text to its original position in object
			let currentKey: Record<string, any> = translatedResults[targetLanguage];
			for (let i = 0; i < path.length; i++) {
				if (i === path.length - 1) {
					currentKey[path[i]] = resultText;
				} else {
					if (!currentKey[path[i]]) {
						currentKey[path[i]] = {};
					}
					currentKey = currentKey[path[i]];
				}
			}
		}
	};

	await applyRecursive(inputJson, [], translate, [
		targetLanguages,
		translator,
		translatedResults,
	]);

	return translatedResults;
};

function buildOutputFileName(
	targetLang: string,
	outputFileNamePattern: string,
) {
	return `${outputFileNamePattern.replace("{language}", targetLang)}`
}

export {
	replaceAll,
	removeKeepTagsFromString,
	replaceParameterStringsInJSONValueWithKeepTags,
	translateRecursive,
	buildOutputFileName,
	TranslatedJSONResults,
};
