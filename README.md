# DeepL Translate Github Action 

This action uses the DeepL Translate API to translate text files in your repository to your target languages. The output will follow the file extension of the given input file.

## Inputs

| Name                  | Description                                      | Required | Default | 
| --------------------- | ------------------------------------------------ |:--------:| ------- |
| `deepl_api_key`       | API Key for DeepL API                            |   yes     |  |
| `target_languages`    | Target languages to translate to                 |   yes    |         |
| `input_file_path`     | Path of the file you want to translate           |   yes    |         |  
| `output_file_name_prefix` | Prefix of the output file name, including folder name |   no     |         |
| `ignore_terms`        | Terms to ignore when translating                 |   no     |         |  
| `no_translate_start_tag` | Start tag to ignore when translating           |   no     |  `<!-- notranslate -->`  |
| `no_translate_end_tag`   | End tag to ignore when translating                |   no     | `<!-- /notranslate -->` |


## How to use

<details><summary>How to get DeepL API Token</summary>

First, you need to [sign up for a DeepL account](https://www.deepl.com/). Then you can go to https://www.deepl.com/account/summary and retrieve your token there.

![Screenshot of where the auth key is located on the website](DeepL_API_Auth_Key_Example.png)

</details>

<details><summary>If you don't have an existing GitHub Action workflow for your repository</summary>

1. Create a folder `.github/workflows` if you don't have it already 
2. Inside that folder, create a YAML file say `translate.yml`
3. In the `translate.yml` file, you can copy the example below and modify it to your usage.
</details>

## Example usage

```yaml
name: Translate documents from docs/simple folder 
on: 
  workflow_dispatch: 
  pull_request: 
    types: [opened, synchronize] 

jobs:
  build: 
    runs-on: ubuntu-latest
    steps: 
      - name: DeepL Translate Github Action 
        uses: lyqht/deepl-translate-github-action@v1.0.0
        with: 
          target_languages: zh,ja 
          input_file_path: docs/simple/original.md 
          output_file_name_prefix: docs/simple/
          deepl_api_key: ${{ secrets.DEEPL_API_KEY }} 
```

With this workflow, you will get `docs/simple/zh.md` and `docs/simple/ja.md`

## Demo

For a demo, refer to Example 1 in this repository [deepl-demo](https://github.com/lyqht/deepl-demo).
