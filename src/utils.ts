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
	if (!str.includes('<keep>')) return str

	const textWithNoTranslateStartTagReplaced = replaceAll(
		str,
		"<keep>",
		"",
	);
	const textWithNoTranslateEndTagReplaced = replaceAll(
		textWithNoTranslateStartTagReplaced,
		"</keep>",
		"",
	);
	return textWithNoTranslateEndTagReplaced
}

type PossibleRecursive<T> = {
	[K in keyof T]: T[K] extends object ? PossibleRecursive<T[K]> : T[K];
  };

type TranslatedJSONResults = Record<TargetLanguageCode, PossibleRecursive<Record<string, string>>>;

const translateRecursive = async (inputJson: Record<string, any>, targetLanguages: TargetLanguageCode[], translator: Translator, translatedResults: TranslatedJSONResults) => {
	const keys = Object.keys(inputJson);

	for (const key of keys) {
	  if (typeof inputJson[key] === 'object') {
		await translateRecursive(inputJson[key], targetLanguages, translator, translatedResults);
		continue;
	  }

	  const value = inputJson[key];
	  const textToBeTranslated = replaceParameterStringsInJSONValueWithKeepTags(value)

	  console.info(`Translating the input file into ${targetLanguages.length} languages...`);

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
		translatedResults[targetLanguage][key] = resultText;
	  }
	}

	return translatedResults;
  }

  export {
    replaceAll,
    removeKeepTagsFromString,
	replaceParameterStringsInJSONValueWithKeepTags,
	translateRecursive,
	TranslatedJSONResults
}
