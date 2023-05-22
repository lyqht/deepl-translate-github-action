import * as deepl from 'deepl-node';
import fs from 'fs';
import path from 'path';

const authKey = process.env.deepl_api_key as string;
const translator = new deepl.Translator(authKey);
const targetLanguages = process.env.target_languages?.split(',') as string[];
const inputFilePath =  path.join(process.env.GITHUB_WORKSPACE as string, process.env.input_file_path as string);
const outputFileNamePrefix = path.join(process.env.GITHUB_WORKSPACE as string,process.env.output_file_name_prefix as string);
const termsToIgnoreForTranslation = process.env.ignore_terms?.split(',') || [] as string[];
const startTagForNoTranslate = process.env.no_translate_start_tag as string;
const endTagForNoTranslate = process.env.no_translate_end_tag as string;

const tempFilePath = 'to_translate.txt';

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
    if (termsToIgnoreForTranslation.length > 0)
    fs.readFile(inputFilePath, 'utf8', async function (err, text) {
        if (err) {
            return console.log(err);
        }

        termsToIgnoreForTranslation.forEach(term => {
            text = text.replace(new RegExp(term, 'g'), `<keep>${term}</keep>`)
        })

        const textWithNoTranslateStartTagReplaced = replaceAll(text, startTagForNoTranslate, '<keep>')
        const textWithNoTranslateEndTagReplaced = replaceAll(textWithNoTranslateStartTagReplaced, endTagForNoTranslate, '</keep>')


        fs.writeFile(tempFilePath, textWithNoTranslateEndTagReplaced, function (err) {
            if (err) return console.log(err);
            console.log(`Created file to be translated`)
        })
    })

    const fileExtension = path.extname(inputFilePath)

    const tempFileExists = fs.existsSync(tempFilePath)
    const translateFilePath = tempFileExists ? tempFilePath : inputFilePath

    console.log(`DeepL supports ${targetLanguages.length} languages. Translating the input file into all supported languages...`)
    fs.readFile(translateFilePath, 'utf8', async function (err, text) {
        if (err) {
            return console.log(err);
        }
        
        for (const targetLanguage of targetLanguages) {
            const targetLang = targetLanguage as deepl.TargetLanguageCode
            const textResult = await translator.translateText(
                text,
                null,
                targetLang,
                {
                    preserveFormatting: true,
                    tagHandling: 'xml',
                    ignoreTags: ['keep']
                }
            );

            const translatedText = textResult.text;
            
            // remove added keep tags
            const textWithNoTranslateStartTagReplaced = replaceAll(translatedText, '<keep>', '')
            const textWithNoTranslateEndTagReplaced = replaceAll(textWithNoTranslateStartTagReplaced, '</keep>', '')
            
    
            fs.writeFile(`${outputFileNamePrefix}${targetLang}.${fileExtension}`, textWithNoTranslateEndTagReplaced, function (err) {
                if (err) return console.log(err);
                console.log(`Translated ${targetLang}`)
            });
        }
    });
})();