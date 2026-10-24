const YTD_OPTIONS = (() => {
  const LANGUAGE_STORAGE_KEY = "ytd_options_language";
  const PREVIEW_STORAGE_PREFIX = "youtubeDigestPreview:";
  const SUPPORTED_LANGUAGES = new Set(["en", "zh-CN"]);

  const COPY = {
    en: {
      pageTitle: "YouTube Digest Settings",
      languageGroupLabel: "Interface language",
      heading: "Bring your own API keys",
      lede:
        "Keys stay in this Chrome profile and are sent only to Supadata and the AI provider you select. This open-source extension has no developer server or analytics.",
      transcriptProvider: "Transcript provider",
      supadataApiKeyLabel: "Supadata API key",
      supadataHelp: "Used to fetch timestamped YouTube subtitles. ",
      supadataLink: "Create a Supadata account and key",
      supadataHelpSuffix:
        ". Supadata generates the key during onboarding.",
      aiProvider: "AI provider",
      providerLabel: "Provider",
      deepseekProvider: "DeepSeek Official",
      customProvider: "Company OpenAI-compatible",
      baseUrlLabel: "Base URL",
      modelIdLabel: "Model ID",
      aiApiKeyLabel: "API key",
      deepseekBaseUrlHelp:
        "For safety, DeepSeek keys can be sent only to api.deepseek.com.",
      customBaseUrlHelp:
        "Verify the HTTPS address with your company. Chrome will ask you to approve access to exactly that API host.",
      deepseekAiHelp:
        "Default: use DeepSeek's official API directly. ",
      customAiHelp:
        "Ask your company's AI administrator for the exact Base URL, model ID, and API key. The service must support OpenAI-compatible Chat Completions. ",
      deepseekAiLink: "Create a DeepSeek API key",
      customAiLink: "",
      privacyNote:
        "When you use AI features, the selected provider receives the video transcript and relevant video context. Custom requests go only to the HTTPS host you enter and approve in Chrome.",
      saveSettings: "Save settings",
      testConnection: "Test Connection",
      localRemix: "Local remix",
      customizationTitle: "Want to use another AI model?",
      customizationPurpose: "Edit and copy a safe prompt for your coding agent",
      agentBadge: "Coding agent ready",
      customizationIntro:
        "You can edit the prompt directly. Complete these three steps before copying:",
      customizationStepFolder:
        "Open the extracted YouTube Digest project folder in your coding agent.",
      customizationStepReplace:
        "Replace [PROVIDER] and [MODEL] with the service and model you want to use.",
      customizationStepKeys:
        "Never include API keys in the prompt or chat. Enter them yourself after the code is ready.",
      customizationPromptLabel: "Editable customization prompt",
      customizationReminderLabel: "Prompt reminder",
      customizationReminder:
        "Before copying, replace [PROVIDER] and [MODEL] with the provider and model you want to use.",
      customizationPrompt:
        "Customize this local YouTube Digest workspace to use [PROVIDER] with [MODEL]. Work only in the current workspace. Before editing, verify that it contains manifest.json and that the manifest name starts with YouTube Digest. If verification fails, stop and ask me to open the extracted YouTube Digest project folder in my coding agent. Do not search other folders, edit a guessed copy, assume an installation path, or claim Chrome can reveal the absolute OS source path. Update the provider's API endpoint, request format, and minimum Chrome host permissions. Preserve bring-your-own-key and local Chrome storage. Never put API keys in source code, commits, logs, screenshots, this prompt, or chat; after the code is ready, tell me where to enter the key myself. Keep DeepSeek-only request fields and retry behavior isolated to DeepSeek. Handle provider-specific rules separately so one provider does not affect another. Update README.md, README.zh-CN.md, PRIVACY.md, SECURITY.md, and tests. Run npm test, npm run check, and npm run package. Then explain how to reload the unpacked extension and test it on a real YouTube video.",
      copyCustomizationPrompt: "Copy edited prompt",
      localData: "Local data",
      localDataHelp:
        "Digests, translations, and notes are stored only in this Chrome profile. You can remove them at any time.",
      clearCache: "Clear cached digests",
      deleteNotes: "Delete all notes",
      resetData: "Reset extension data",
      footer:
        'Read <a href="PRIVACY.md" target="_blank">PRIVACY.md</a> in the repository for the complete data-flow description.',
      migrationWarning:
        "An unsupported or legacy AI provider was removed safely. Your Supadata key was kept, but the AI key was cleared. Choose a provider and enter its API key.",
      saving: "Saving…",
      addSupadataKey: "Add a Supadata API key.",
      addAiKey: "Add an API key for the selected AI provider.",
      invalidAiSettings: ({ reason }) => `Check the AI settings: ${reason}`,
      saved: "Saved. Reopen YouTube Digest to use these settings.",
      saveFailed: "Could not save settings. Please try again.",
      customPermissionDenied:
        "Chrome did not grant access to the configured company API host. No key or transcript was sent.",
      testingConnection: "Testing the selected provider and model…",
      connectionSucceeded: ({ provider, model, endpoint }) =>
        `Connected to ${provider} with ${model}. Endpoint: ${endpoint}.`,
      connectionFailed: ({ provider, model, status, endpoint }) =>
        `Connection failed for ${provider || "the selected provider"}${model ? ` / ${model}` : ""}${status ? ` (HTTP ${status})` : ""}.${endpoint ? ` Endpoint: ${endpoint}.` : ""} Check the API key, model ID, Base URL, account permissions, quota, and request format.`,
      connectionTestUnavailable:
        "Connection testing is available only from the installed extension settings page.",
      copying: "Copying…",
      promptCopied: "Edited prompt copied.",
      copyFailed:
        "Could not copy the prompt. Select the prompt text and copy it manually.",
      clearedDigests: ({ count }) =>
        `Cleared ${count} cached digest${count === 1 ? "" : "s"}.`,
      notesDeleted: "Deleted all saved notes.",
      resetConfirm:
        "Delete API keys, cached digests, translations, and saved notes from this Chrome profile?",
      allDataDeleted: "All YouTube Digest data was deleted.",
      settingsLoadFailed:
        "Could not load saved settings. You can still preview this page.",
    },
    "zh-CN": {
      pageTitle: "YouTube Digest 设置",
      languageGroupLabel: "界面语言",
      heading: "使用你自己的 API 密钥",
      lede:
        "密钥仅保存在当前 Chrome 个人资料中，只会发送给 Supadata 和你选择的 AI 服务。本开源扩展没有开发者服务器，也不使用分析服务。",
      transcriptProvider: "字幕服务",
      supadataApiKeyLabel: "Supadata API 密钥",
      supadataHelp: "用于获取带时间戳的 YouTube 字幕。",
      supadataLink: "创建 Supadata 账号并获取密钥",
      supadataHelpSuffix: "。Supadata 会在引导流程中生成密钥。",
      aiProvider: "AI 服务",
      providerLabel: "服务商",
      deepseekProvider: "DeepSeek 官方",
      customProvider: "其他公司 OpenAI-compatible",
      baseUrlLabel: "Base URL",
      modelIdLabel: "模型 ID",
      aiApiKeyLabel: "API 密钥",
      deepseekBaseUrlHelp:
        "为确保安全，DeepSeek 密钥只能发送到 api.deepseek.com。",
      customBaseUrlHelp:
        "请先向公司确认这个 HTTPS 地址。Chrome 会要求你单独批准访问该 API 主机。",
      deepseekAiHelp: "默认直接使用 DeepSeek 官方 API。",
      customAiHelp:
        "请向公司的 AI 管理员索取准确的 Base URL、模型 ID 和 API Key；平台必须支持 OpenAI-compatible Chat Completions。",
      deepseekAiLink: "创建 DeepSeek API 密钥",
      customAiLink: "",
      privacyNote:
        "使用 AI 功能时，所选 AI 服务会收到视频字幕及相关视频上下文。自定义请求只会发送到你填写并在 Chrome 中批准的 HTTPS 主机。",
      saveSettings: "保存设置",
      testConnection: "测试连接",
      localRemix: "本地改造",
      customizationTitle: "想使用其他 AI 模型？",
      customizationPurpose: "编辑并复制一段可安全交给编程 Agent 的提示词",
      agentBadge: "可交给编程 Agent",
      customizationIntro: "你可以直接编辑提示词。复制前完成以下三步：",
      customizationStepFolder:
        "在编程 Agent 中打开 YouTube Digest 解压后的项目文件夹。",
      customizationStepReplace:
        "把 [PROVIDER] 和 [MODEL] 替换成你想使用的服务和模型。",
      customizationStepKeys:
        "不要在提示词或聊天中加入 API 密钥。代码准备好后，请自行填写。",
      customizationPromptLabel: "可编辑的自定义提示词",
      customizationReminderLabel: "提示词提醒",
      customizationReminder:
        "复制前，请先把 [PROVIDER] 和 [MODEL] 替换成你想使用的服务和模型。",
      customizationPrompt:
        "请把当前本地 YouTube Digest 工作区改为使用 [PROVIDER] 提供的 [MODEL]。只在当前工作区中操作。编辑前，先确认其中包含 manifest.json，且 manifest 中的 name 以 YouTube Digest 开头。如果验证失败，请停止，并让我在编程 Agent 中打开 YouTube Digest 解压后的项目文件夹。不要搜索其他文件夹，不要编辑猜测的副本，不要假设安装路径，也不要声称 Chrome 可以显示操作系统中的绝对源码路径。更新该服务的 API endpoint、请求格式和最少的 Chrome host permissions。保留用户自带密钥模式和 Chrome 本地存储。不要把 API 密钥写入源代码、提交记录、日志、截图、这段提示词或聊天；代码准备好后，请告诉我应该在哪里自行填写密钥。DeepSeek 专用的请求参数和重试逻辑继续只用于 DeepSeek。新服务的专属规则请单独处理，避免相互影响。更新 README.md、README.zh-CN.md、PRIVACY.md、SECURITY.md 和测试。运行 npm test、npm run check 和 npm run package。最后，说明如何重新加载已解压的扩展，并在真实 YouTube 视频上测试。",
      copyCustomizationPrompt: "复制编辑后的提示词",
      localData: "本地数据",
      localDataHelp:
        "摘要、翻译和笔记仅保存在当前 Chrome 个人资料中。你可以随时删除。",
      clearCache: "清除缓存的摘要",
      deleteNotes: "删除全部笔记",
      resetData: "重置扩展数据",
      footer:
        '完整数据流说明请参阅仓库中的 <a href="PRIVACY.md" target="_blank">PRIVACY.md</a>。',
      migrationWarning:
        "已安全移除不再支持或旧版的 AI 服务设置。Supadata 密钥已保留，AI 密钥已清除。请选择服务商并填写对应密钥。",
      saving: "正在保存…",
      addSupadataKey: "请添加 Supadata API 密钥。",
      addAiKey: "请填写所选 AI 服务的 API 密钥。",
      invalidAiSettings: ({ reason }) => `请检查 AI 设置：${reason}`,
      saved: "已保存。请重新打开 YouTube Digest 以使用这些设置。",
      saveFailed: "无法保存设置，请重试。",
      customPermissionDenied:
        "Chrome 未授权访问所填的公司 API 主机，因此没有发送密钥或字幕。",
      testingConnection: "正在测试所选服务和模型…",
      connectionSucceeded: ({ provider, model, endpoint }) =>
        `连接成功：${provider} / ${model}。请求地址：${endpoint}。`,
      connectionFailed: ({ provider, model, status, endpoint }) =>
        `连接失败：${provider || "所选服务"}${model ? ` / ${model}` : ""}${status ? `（HTTP ${status}）` : ""}。${endpoint ? `请求地址：${endpoint}。` : ""}请检查 API 密钥、模型 ID、Base URL、账号权限、额度和请求格式。`,
      connectionTestUnavailable:
        "只能在已安装扩展的设置页面中测试连接。",
      copying: "正在复制…",
      promptCopied: "已复制编辑后的提示词。",
      copyFailed: "无法复制提示词。请选中提示词文本并手动复制。",
      clearedDigests: ({ count }) => `已清除 ${count} 条缓存摘要。`,
      notesDeleted: "已删除全部已保存的笔记。",
      resetConfirm:
        "要从当前 Chrome 个人资料中删除 API 密钥、缓存摘要、翻译和已保存的笔记吗？",
      allDataDeleted: "已删除全部 YouTube Digest 数据。",
      settingsLoadFailed: "无法加载已保存的设置，但你仍可预览此页面。",
    },
  };

  function normalizeLanguage(language) {
    return SUPPORTED_LANGUAGES.has(language) ? language : "en";
  }

  function translate(language, key, params = {}) {
    const normalizedLanguage = normalizeLanguage(language);
    const value = COPY[normalizedLanguage][key] ?? COPY.en[key] ?? "";
    return typeof value === "function" ? value(params) : value;
  }

  function createStorageAdapter(chromeApi, fallbackStorage) {
    const chromeStorage = chromeApi?.storage?.local;
    const memoryStorage = new Map();

    function fallbackKeys() {
      const keys = [];
      if (!fallbackStorage) return keys;
      try {
        for (let index = 0; index < fallbackStorage.length; index += 1) {
          const key = fallbackStorage.key(index);
          if (key?.startsWith(PREVIEW_STORAGE_PREFIX)) keys.push(key);
        }
      } catch (_error) {
        return [];
      }
      return keys;
    }

    function readFallbackValue(key) {
      try {
        const rawValue = fallbackStorage?.getItem(
          `${PREVIEW_STORAGE_PREFIX}${key}`,
        );
        if (rawValue !== null && rawValue !== undefined) {
          return JSON.parse(rawValue);
        }
      } catch (_error) {
        // Fall through to memory when localStorage is unavailable or malformed.
      }
      return memoryStorage.get(key);
    }

    function writeFallbackValue(key, value) {
      memoryStorage.set(key, value);
      try {
        fallbackStorage?.setItem(
          `${PREVIEW_STORAGE_PREFIX}${key}`,
          JSON.stringify(value),
        );
      } catch (_error) {
        // The in-memory copy keeps a restricted preview functional.
      }
    }

    return {
      async get(keys) {
        if (chromeStorage) return chromeStorage.get(keys);

        const requestedKeys =
          keys === null
            ? [
                ...new Set([
                  ...memoryStorage.keys(),
                  ...fallbackKeys().map((key) =>
                    key.slice(PREVIEW_STORAGE_PREFIX.length),
                  ),
                ]),
              ]
            : Array.isArray(keys)
              ? keys
              : [keys];

        return Object.fromEntries(
          requestedKeys
            .map((key) => [key, readFallbackValue(key)])
            .filter(([, value]) => value !== undefined),
        );
      },

      async set(items) {
        if (chromeStorage) return chromeStorage.set(items);
        for (const [key, value] of Object.entries(items)) {
          writeFallbackValue(key, value);
        }
      },

      async remove(keys) {
        if (chromeStorage) return chromeStorage.remove(keys);
        for (const key of Array.isArray(keys) ? keys : [keys]) {
          memoryStorage.delete(key);
          try {
            fallbackStorage?.removeItem(`${PREVIEW_STORAGE_PREFIX}${key}`);
          } catch (_error) {
            // Memory removal is sufficient for this preview session.
          }
        }
      },

      async clear() {
        if (chromeStorage) return chromeStorage.clear();
        memoryStorage.clear();
        for (const key of fallbackKeys()) {
          try {
            fallbackStorage.removeItem(key);
          } catch (_error) {
            // Continue clearing any remaining preview keys.
          }
        }
      },
    };
  }

  async function readPreferredLanguage(storage) {
    const stored = await storage.get(LANGUAGE_STORAGE_KEY);
    return normalizeLanguage(stored[LANGUAGE_STORAGE_KEY]);
  }

  async function persistPreferredLanguage(storage, language) {
    const normalizedLanguage = normalizeLanguage(language);
    await storage.set({ [LANGUAGE_STORAGE_KEY]: normalizedLanguage });
    return normalizedLanguage;
  }

  function updateLanguageButtonState(buttons, language) {
    const normalizedLanguage = normalizeLanguage(language);
    for (const button of buttons) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === normalizedLanguage),
      );
    }
  }

  function updateLocalizedPrompt(textarea, prompt) {
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectionDirection = textarea.selectionDirection;
    const scrollTop = textarea.scrollTop;
    const scrollLeft = textarea.scrollLeft;

    textarea.value = prompt;

    if (
      Number.isInteger(selectionStart) &&
      Number.isInteger(selectionEnd) &&
      typeof textarea.setSelectionRange === "function"
    ) {
      textarea.setSelectionRange(
        Math.min(selectionStart, prompt.length),
        Math.min(selectionEnd, prompt.length),
        selectionDirection || "none",
      );
    }
    textarea.scrollTop = scrollTop;
    textarea.scrollLeft = scrollLeft;
  }

  function createPromptDrafts() {
    return {
      en: translate("en", "customizationPrompt"),
      "zh-CN": translate("zh-CN", "customizationPrompt"),
    };
  }

  function switchPromptDraft(
    drafts,
    currentLanguage,
    nextLanguage,
    currentValue,
  ) {
    const normalizedCurrentLanguage = normalizeLanguage(currentLanguage);
    const normalizedNextLanguage = normalizeLanguage(nextLanguage);
    drafts[normalizedCurrentLanguage] = String(currentValue ?? "");
    if (typeof drafts[normalizedNextLanguage] !== "string") {
      drafts[normalizedNextLanguage] = translate(
        normalizedNextLanguage,
        "customizationPrompt",
      );
    }
    return {
      language: normalizedNextLanguage,
      prompt: drafts[normalizedNextLanguage],
    };
  }

  async function copyPromptValue(clipboard, value) {
    await clipboard.writeText(value);
  }

  function getSafeLocalStorage(root) {
    try {
      return root.localStorage;
    } catch (_error) {
      return null;
    }
  }

  async function requestOriginPermission(chromeApi, originPattern) {
    if (!chromeApi?.permissions?.request || !originPattern) return false;
    try {
      return await chromeApi.permissions.request({ origins: [originPattern] });
    } catch (_error) {
      return false;
    }
  }

  async function removeOriginPermission(chromeApi, originPattern) {
    if (!chromeApi?.permissions?.remove || !originPattern) return false;
    try {
      return await chromeApi.permissions.remove({ origins: [originPattern] });
    } catch (_error) {
      return false;
    }
  }

  function initialize(root = globalThis) {
    const doc = root.document;
    const settingsApi = root.YTD_SETTINGS;
    if (!doc || !settingsApi) return;

    const storage = createStorageAdapter(
      root.chrome,
      getSafeLocalStorage(root),
    );
    const form = doc.getElementById("settingsForm");
    const providerSelect = doc.getElementById("provider");
    const aiBaseUrlInput = doc.getElementById("aiBaseUrl");
    const aiModelInput = doc.getElementById("aiModel");
    const aiApiKeyInput = doc.getElementById("aiApiKey");
    const supadataApiKeyInput = doc.getElementById("supadataApiKey");
    const baseUrlHelp = doc.getElementById("baseUrlHelp");
    const aiProviderHelp = doc.getElementById("aiProviderHelp");
    const aiProviderLink = doc.getElementById("aiProviderLink");
    const testConnectionBtn = doc.getElementById("testConnectionBtn");
    const customizationPrompt = doc.getElementById("customizationPrompt");
    const copyCustomizationPromptBtn = doc.getElementById(
      "copyCustomizationPromptBtn",
    );
    const copyStatus = doc.getElementById("copyStatus");
    const saveStatus = doc.getElementById("saveStatus");
    const testStatus = doc.getElementById("testStatus");
    const dataStatus = doc.getElementById("dataStatus");
    const languageButtons = [...doc.querySelectorAll("[data-language]")];
    const statusStates = new Map();
    const promptDrafts = createPromptDrafts();
    let currentLanguage = "en";

    function renderStatus(element) {
      const state = statusStates.get(element);
      element.textContent = state
        ? translate(currentLanguage, state.key, state.params)
        : "";
    }

    function setStatus(element, key, params = {}) {
      statusStates.set(element, { key, params });
      renderStatus(element);
    }

    function readAiForm() {
      return {
        settingsVersion: settingsApi.SETTINGS_VERSION,
        provider: providerSelect.value,
        aiBaseUrl: aiBaseUrlInput.value,
        aiModel: aiModelInput.value,
        aiApiKey: aiApiKeyInput.value,
        supadataApiKey: supadataApiKeyInput.value,
      };
    }

    function renderProviderDetails() {
      const provider = Object.hasOwn(settingsApi.PROVIDERS, providerSelect.value)
        ? providerSelect.value
        : settingsApi.DEFAULTS.provider;
      const isDeepSeek = provider === "deepseek";
      const copyPrefix = isDeepSeek ? "deepseek" : "custom";
      baseUrlHelp.textContent = translate(
        currentLanguage,
        `${copyPrefix}BaseUrlHelp`,
      );
      aiProviderHelp.textContent = translate(
        currentLanguage,
        `${copyPrefix}AiHelp`,
      );
      aiProviderLink.textContent = translate(
        currentLanguage,
        `${copyPrefix}AiLink`,
      );
      aiProviderLink.hidden = provider === "custom";
      if (isDeepSeek) {
        aiProviderLink.href = "https://platform.deepseek.com/api_keys";
      } else {
        aiProviderLink.removeAttribute("href");
      }
      aiApiKeyInput.placeholder = isDeepSeek
        ? "Paste your DeepSeek key"
        : "Paste your company API key";
    }

    async function requestCustomHostPermission(settings) {
      if (settings.provider !== "custom") return true;
      return requestOriginPermission(
        root.chrome,
        settingsApi.optionalOriginPattern(settings),
      );
    }

    async function removeReplacedCustomPermission(previous, next) {
      if (previous?.provider !== "custom") return;
      let previousPattern;
      try {
        previousPattern = settingsApi.optionalOriginPattern(previous);
      } catch (_error) {
        return;
      }
      const nextPattern =
        next.provider === "custom"
          ? settingsApi.optionalOriginPattern(next)
          : "";
      if (!previousPattern || previousPattern === nextPattern) return;
      // Saving the new provider remains safe even if Chrome retains an old
      // user-granted host permission. The old key is never preserved.
      await removeOriginPermission(root.chrome, previousPattern);
    }

    function applyProviderDefaults(provider) {
      const defaults = settingsApi.providerDefaults(provider);
      providerSelect.value = defaults.provider;
      aiBaseUrlInput.value = defaults.aiBaseUrl;
      aiModelInput.value = defaults.aiModel;
      // Never carry a credential across providers. The user must explicitly
      // enter the key that belongs to the newly selected service.
      aiApiKeyInput.value = "";
      renderProviderDetails();
      statusStates.delete(testStatus);
      renderStatus(testStatus);
    }

    function applyLanguage(language) {
      const nextDraft = switchPromptDraft(
        promptDrafts,
        currentLanguage,
        language,
        customizationPrompt.value,
      );
      currentLanguage = nextDraft.language;
      doc.documentElement.lang = currentLanguage;
      doc.title = translate(currentLanguage, "pageTitle");

      for (const element of doc.querySelectorAll("[data-i18n]")) {
        element.textContent = translate(
          currentLanguage,
          element.dataset.i18n,
        );
      }
      for (const element of doc.querySelectorAll("[data-i18n-html]")) {
        element.innerHTML = translate(
          currentLanguage,
          element.dataset.i18nHtml,
        );
      }
      for (const element of doc.querySelectorAll("[data-i18n-aria-label]")) {
        element.setAttribute(
          "aria-label",
          translate(currentLanguage, element.dataset.i18nAriaLabel),
        );
      }

      updateLocalizedPrompt(
        customizationPrompt,
        nextDraft.prompt,
      );
      updateLanguageButtonState(languageButtons, currentLanguage);
      for (const element of statusStates.keys()) renderStatus(element);
      renderProviderDetails();
    }

    async function loadSettings() {
      try {
        const stored = await storage.get(settingsApi.STORAGE_KEY);
        const migration = settingsApi.migrateLegacyCustom(
          stored[settingsApi.STORAGE_KEY],
        );
        const settings = migration.settings;

        providerSelect.value = settings.provider;
        aiBaseUrlInput.value = settings.aiBaseUrl;
        aiModelInput.value = settings.aiModel;
        aiApiKeyInput.value = settings.aiApiKey;
        supadataApiKeyInput.value = settings.supadataApiKey;
        renderProviderDetails();
        if (migration.migrated) {
          await storage.set({ [settingsApi.STORAGE_KEY]: settings });
          setStatus(saveStatus, "migrationWarning");
        }
      } catch (_error) {
        setStatus(saveStatus, "settingsLoadFailed");
      }
    }

    async function loadOptions() {
      try {
        applyLanguage(await readPreferredLanguage(storage));
      } catch (_error) {
        applyLanguage("en");
      }
      await loadSettings();
    }

    async function saveSettings(event) {
      event.preventDefault();
      setStatus(saveStatus, "saving");

      let settings;
      try {
        settings = settingsApi.normalize(readAiForm());
      } catch (error) {
        setStatus(saveStatus, "invalidAiSettings", {
          reason: error.message,
        });
        return;
      }

      if (!settings.supadataApiKey) {
        setStatus(saveStatus, "addSupadataKey");
        return;
      }
      if (!settings.aiApiKey) {
        setStatus(saveStatus, "addAiKey");
        return;
      }

      if (!(await requestCustomHostPermission(settings))) {
        setStatus(saveStatus, "customPermissionDenied");
        return;
      }

      try {
        const previous = await storage.get(settingsApi.STORAGE_KEY);
        await storage.set({ [settingsApi.STORAGE_KEY]: settings });
        await removeReplacedCustomPermission(
          previous[settingsApi.STORAGE_KEY],
          settings,
        );
        setStatus(saveStatus, "saved");
      } catch (_error) {
        setStatus(saveStatus, "saveFailed");
      }
    }

    async function testConnection() {
      let settings;
      try {
        settings = settingsApi.normalize(readAiForm());
      } catch (error) {
        setStatus(testStatus, "invalidAiSettings", {
          reason: error.message,
        });
        return;
      }
      if (!settings.aiApiKey) {
        setStatus(testStatus, "addAiKey");
        return;
      }
      if (!root.chrome?.runtime?.sendMessage) {
        setStatus(testStatus, "connectionTestUnavailable");
        return;
      }
      if (!(await requestCustomHostPermission(settings))) {
        setStatus(testStatus, "customPermissionDenied");
        return;
      }

      testConnectionBtn.disabled = true;
      setStatus(testStatus, "testingConnection");
      try {
        const result = await root.chrome.runtime.sendMessage({
          action: "testAiConnection",
          settings,
        });
        if (!result?.success) {
          setStatus(testStatus, "connectionFailed", {
            provider: result?.provider,
            model: result?.model || settings.aiModel,
            status: result?.status,
            endpoint: result?.endpointOrigin,
          });
          return;
        }

        setStatus(testStatus, "connectionSucceeded", {
          provider: result.provider,
          model: result.model,
          endpoint: result.endpointOrigin,
        });
      } catch (_error) {
        setStatus(testStatus, "connectionFailed", {
          provider: settingsApi.providerLabel(settings.provider),
          model: settings.aiModel,
          endpoint: new URL(settings.aiBaseUrl).origin,
        });
      } finally {
        testConnectionBtn.disabled = false;
      }
    }

    async function copyCustomizationPrompt() {
      setStatus(copyStatus, "copying");
      try {
        await copyPromptValue(
          root.navigator.clipboard,
          customizationPrompt.value,
        );
        setStatus(copyStatus, "promptCopied");
      } catch (_error) {
        setStatus(copyStatus, "copyFailed");
      }
    }

    async function clearCachedDigests() {
      const all = await storage.get(null);
      const keys = Object.keys(all).filter((key) => key.startsWith("digest_"));
      if (keys.length) await storage.remove(keys);
      setStatus(dataStatus, "clearedDigests", { count: keys.length });
    }

    async function clearNotes() {
      await storage.remove("ytd_notes");
      setStatus(dataStatus, "notesDeleted");
    }

    async function resetAllData() {
      const confirmed = root.confirm(
        translate(currentLanguage, "resetConfirm"),
      );
      if (!confirmed) return;

      await storage.clear();
      await persistPreferredLanguage(storage, currentLanguage);
      await loadSettings();
      setStatus(dataStatus, "allDataDeleted");
    }

    form.addEventListener("submit", saveSettings);
    providerSelect.addEventListener("change", () => {
      applyProviderDefaults(providerSelect.value);
    });
    testConnectionBtn.addEventListener("click", testConnection);
    copyCustomizationPromptBtn.addEventListener(
      "click",
      copyCustomizationPrompt,
    );
    doc
      .getElementById("clearCacheBtn")
      .addEventListener("click", clearCachedDigests);
    doc.getElementById("clearNotesBtn").addEventListener("click", clearNotes);
    doc.getElementById("resetBtn").addEventListener("click", resetAllData);
    for (const button of languageButtons) {
      button.addEventListener("click", async () => {
        const language = button.dataset.language;
        applyLanguage(language);
        await persistPreferredLanguage(storage, language);
      });
    }

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", loadOptions, { once: true });
    } else {
      void loadOptions();
    }
  }

  return {
    COPY,
    LANGUAGE_STORAGE_KEY,
    copyPromptValue,
    createPromptDrafts,
    createStorageAdapter,
    normalizeLanguage,
    persistPreferredLanguage,
    readPreferredLanguage,
    removeOriginPermission,
    requestOriginPermission,
    translate,
    updateLanguageButtonState,
    updateLocalizedPrompt,
    switchPromptDraft,
    initialize,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = YTD_OPTIONS;
}

if (typeof document !== "undefined") {
  YTD_OPTIONS.initialize();
}
