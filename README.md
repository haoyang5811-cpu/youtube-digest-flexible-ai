# YouTube Digest - Flexible AI

Turn YouTube videos into learning resources with transcripts, bilingual translation, AI overviews, explanations, and notes.

This repository is an independent community remix of [YouTube Digest by Zara Zhang](https://github.com/zarazhangrui/youtube-digest). It is not an official release of, or endorsement by, the upstream author or any AI provider. The original MIT license and attribution are preserved.

[简体中文](README.zh-CN.md)

## Choose a setup path

| Route | Best for | What you provide |
| --- | --- | --- |
| DeepSeek Official | Individuals using their own account | DeepSeek API key |
| Company OpenAI-compatible | People with an approved company AI gateway | HTTPS Base URL, Model ID, and token |

Both routes also need a Supadata API key to retrieve video transcripts. Supadata and AI usage are billed separately by their respective providers.

## Features

- Read the complete transcript beside the video.
- Translate transcript segments into English or Simplified Chinese.
- Generate structured overviews and explanations.
- Capture timestamped notes and polish them with AI.
- Export notes as Markdown.
- Keep provider settings in local Chrome extension storage.
- Test the selected AI connection before using it on a video.

## Install manually

1. Download and extract the release ZIP to a permanent folder.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted folder containing `manifest.json`.
6. Keep that folder in place. Moving or deleting it breaks the unpacked extension until you load it again from the new location.

Pin the extension if you want quick access to Settings. On a YouTube watch page, use the **Digest** button to open the side panel.

## Configure transcripts

1. Create a Supadata account at [dash.supadata.ai](https://dash.supadata.ai/auth/sign-up).
2. Copy your API key.
3. Open YouTube Digest Settings and paste the key into **Supadata API key**.

The extension requests transcripts through Supadata's [Get Transcript API](https://docs.supadata.ai/get-transcript). It forces `mode=native` when requesting the source transcript. Check [Supadata pricing](https://supadata.ai/pricing) before estimating usage.

## Route 1: DeepSeek Official

1. Create a key on the [DeepSeek API Keys page](https://platform.deepseek.com/api_keys).
2. Choose **DeepSeek Official** in Settings.
3. Keep the default Base URL `https://api.deepseek.com`, or use another documented path on the same official origin.
4. Enter a supported Model ID and your key.
5. Select **Test Connection**, review the displayed endpoint, then save.

This edition defaults to `deepseek-flash`. Model availability and pricing can change, so review the live [DeepSeek pricing and model page](https://api-docs.deepseek.com/quick_start/pricing/) before adding credit.

## Route 2: Company OpenAI-compatible gateway

Use this route only when your organization has approved the gateway and permits the video transcript and related context to be sent to it.

1. Choose **Company OpenAI-compatible** in Settings.
2. Enter the approved HTTPS Base URL.
3. Enter the exact Model ID and token supplied by your organization.
4. Approve Chrome's runtime host-access prompt for that exact origin.
5. Select **Test Connection**, review the endpoint, then save.

Compatibility requirements:

- HTTPS only, without embedded credentials, query parameters, or fragments.
- Bearer authentication in the `Authorization` header.
- An OpenAI-compatible `POST /chat/completions` endpoint.
- A response shaped like `choices[0].message.content`.

Gateways that require OAuth, custom authentication headers, Azure-style `api-version` parameters, or a provider-native non-OpenAI request format need a code change.

## Privacy and security

- API keys are entered in Settings and stored in local Chrome extension storage.
- Keys are not included in this repository or release package.
- DeepSeek keys are restricted to `api.deepseek.com`.
- Custom requests go only to the HTTPS origin you enter and approve in Chrome.
- AI features send the video transcript and relevant context to the selected provider.
- The connection test reports the provider, model, and endpoint without displaying the key.

Review [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md) before use. Company users remain responsible for internal data-handling, acceptable-use, and AI policies.

## Troubleshooting

### The Digest button is missing on a YouTube video

- Confirm you are on a `youtube.com/watch` page.
- Reload the extension on `chrome://extensions`.
- Refresh the video tab.

### Transcript loading fails

- Confirm the Supadata key is valid.
- Check whether the video has an available transcript.
- Review your Supadata quota and service status.

### AI requests fail

- Use **Test Connection** in Settings.
- Confirm the Base URL, Model ID, and key belong to the selected route.
- For a company gateway, confirm the runtime host permission was granted.
- Ask the gateway administrator whether it supports the compatibility requirements above.

## Local verification

```bash
npm test
npm run check
npm run package
```

The packaged extension is written to `dist/`. A real provider test needs valid user-supplied credentials and is not performed by the automated test suite.

## Attribution and license

This community remix is derived from [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest). Thank you to [@zarazhangrui](https://x.com/zarazhangrui) for creating and open-sourcing the original project.

Licensed under the [MIT License](LICENSE). See [NOTICE.md](NOTICE.md) for the remix notice.
