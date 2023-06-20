function replaceAll(str: string, search: string, replacement: string): string {
	let index = str.indexOf(search);
	while (index != -1) {
		str = str.replace(search, replacement);
		index = str.indexOf(search);
	}
	return str;
}

function removeKeepTagsFromString(str: string) {
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

export {
    replaceAll,
    removeKeepTagsFromString
}