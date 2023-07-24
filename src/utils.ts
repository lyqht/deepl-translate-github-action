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

const translateRecursive = async (
	inputJson: Record<string, any>,
	targetLanguages: TargetLanguageCode[],
	translator: Translator,
	translatedResults: TranslatedJSONResults,
	path: string[] = [], // new argument to keep track of the object's nested path
) => {
	const keys = Object.keys(inputJson);

	for (const key of keys) {
		let newPath = [...path, key];

		if (typeof inputJson[key] === "object") {
			await translateRecursive(
				inputJson[key],
				targetLanguages,
				translator,
				translatedResults,
				newPath, // pass the extended path when the current key is an object
			);
			continue;
		}

		const value = inputJson[key];
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
			newPath.reduce<Record<string, string | Record<string, string>>>(
				(prev, curr, idx) => {
					if (idx === newPath.length - 1) {
						prev[curr] = resultText;
					} else if (!prev[curr]) {
						prev[curr] = {};
					}

					return prev[curr] as Record<string, string | Record<string, string>>;
				},
				translatedResults[targetLanguage] as Record<
					string,
					string | Record<string, string>
				>,
			);
		}
	}

	return translatedResults;
};

export {
	replaceAll,
	removeKeepTagsFromString,
	replaceParameterStringsInJSONValueWithKeepTags,
	translateRecursive,
	TranslatedJSONResults,
};
