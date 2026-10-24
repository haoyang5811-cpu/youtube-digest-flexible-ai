/**
 * Shared, non-secret configuration helpers.
 *
 * API keys are stored in chrome.storage.local by options.js. This file contains
 * provider metadata and validation only, so it is safe to publish.
 */
var YTD_SETTINGS = (() => {
  const STORAGE_KEY = "ytd_settings";
  const SETTINGS_VERSION = 3;
  const PROVIDERS = Object.freeze({
    deepseek: Object.freeze({
      id: "deepseek",
      label: "DeepSeek Official",
      defaultBaseUrl: "https://api.deepseek.com",
      defaultModel: "deepseek-flash",
      allowedOrigins: Object.freeze(["https://api.deepseek.com"]),
    }),
    custom: Object.freeze({
      id: "custom",
      label: "Company OpenAI-compatible",
      defaultBaseUrl: "",
      defaultModel: "",
      allowedOrigins: null,
    }),
  });
  const DEFAULTS = Object.freeze({
    provider: "deepseek",
    aiApiKey: "",
    aiBaseUrl: PROVIDERS.deepseek.defaultBaseUrl,
    aiModel: PROVIDERS.deepseek.defaultModel,
    supadataApiKey: "",
  });

  function isLegacyCustom(input) {
    return (
      !!input &&
      input.provider === "custom" &&
      ![2, SETTINGS_VERSION].includes(input.settingsVersion)
    );
  }

  function isUnsupportedProvider(input) {
    return (
      !!input &&
      typeof input.provider === "string" &&
      input.provider.trim() &&
      !Object.hasOwn(PROVIDERS, input.provider)
    );
  }

  function requiresAiReset(input) {
    return isLegacyCustom(input) || isUnsupportedProvider(input);
  }

  function resolveProvider(input = {}) {
    if (isLegacyCustom(input)) return DEFAULTS.provider;
    if (Object.hasOwn(PROVIDERS, input.provider)) return input.provider;

    // Existing v1.2 installs stored a DeepSeek key and may lack a provider in
    // older previews. Keep that credential on DeepSeek during migration.
    if (
      typeof input.aiApiKey === "string" &&
      input.aiApiKey.trim() &&
      (String(input.aiBaseUrl || "").includes("api.deepseek.com") ||
        String(input.aiModel || "").startsWith("deepseek"))
    ) {
      return "deepseek";
    }
    return DEFAULTS.provider;
  }

  function providerDefaults(provider) {
    const providerId = Object.hasOwn(PROVIDERS, provider)
      ? provider
      : DEFAULTS.provider;
    const definition = PROVIDERS[providerId];
    return {
      provider: providerId,
      aiBaseUrl: definition.defaultBaseUrl,
      aiModel: definition.defaultModel,
    };
  }

  function normalizeBaseUrl(provider, rawValue) {
    const definition = PROVIDERS[provider];
    const candidate =
      typeof rawValue === "string" && rawValue.trim()
        ? rawValue.trim()
        : definition.defaultBaseUrl;
    if (!candidate) {
      throw new Error("Base URL is required.");
    }
    let url;
    try {
      url = new URL(candidate);
    } catch (_error) {
      throw new Error("Base URL must be a valid HTTPS URL.");
    }

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error(
        "Base URL must use HTTPS and cannot contain credentials, a query, or a fragment.",
      );
    }
    if (
      Array.isArray(definition.allowedOrigins) &&
      !definition.allowedOrigins.includes(url.origin)
    ) {
      throw new Error(
        `${definition.label} only accepts its documented official API domains.`,
      );
    }

    const pathname = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname === "/" ? "" : pathname}`;
  }

  function normalize(input = {}) {
    const resetAi = requiresAiReset(input);
    const candidate = resetAi
      ? {
          ...input,
          ...providerDefaults(DEFAULTS.provider),
          aiApiKey: "",
        }
      : input;
    const provider = resolveProvider(candidate);
    const definition = PROVIDERS[provider];
    const aiModel =
      typeof candidate.aiModel === "string" && candidate.aiModel.trim()
        ? candidate.aiModel.trim()
        : definition.defaultModel;
    if (aiModel.length > 200 || /[\u0000-\u001f\u007f]/.test(aiModel)) {
      throw new Error("Model ID is invalid.");
    }

    return {
      settingsVersion: SETTINGS_VERSION,
      provider,
      aiApiKey: resetAi
        ? ""
        : typeof candidate.aiApiKey === "string"
          ? candidate.aiApiKey.trim()
          : "",
      aiBaseUrl: normalizeBaseUrl(provider, candidate.aiBaseUrl),
      aiModel,
      supadataApiKey:
        typeof input.supadataApiKey === "string"
          ? input.supadataApiKey.trim()
          : "",
    };
  }

  function migrateLegacyCustom(input = {}) {
    if (!requiresAiReset(input)) {
      return { settings: normalize(input), migrated: false };
    }
    return {
      settings: normalize({
        ...providerDefaults(DEFAULTS.provider),
        aiApiKey: "",
        supadataApiKey: input.supadataApiKey,
      }),
      migrated: true,
    };
  }

  function chatCompletionsUrl(settings) {
    const normalized = normalize(settings);
    if (/\/chat\/completions$/i.test(normalized.aiBaseUrl)) {
      return normalized.aiBaseUrl;
    }
    return `${normalized.aiBaseUrl}/chat/completions`;
  }

  function providerLabel(provider) {
    return PROVIDERS[provider]?.label || PROVIDERS[DEFAULTS.provider].label;
  }

  function optionalOriginPattern(settings) {
    const normalized = normalize(settings);
    if (normalized.provider !== "custom") return "";
    return `${new URL(normalized.aiBaseUrl).origin}/*`;
  }

  function canonicalYouTubeUrl(videoId) {
    const normalized = String(videoId || "").trim();
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(normalized)) {
      throw new Error("Invalid YouTube video ID.");
    }
    return `https://www.youtube.com/watch?v=${normalized}`;
  }

  return {
    STORAGE_KEY,
    SETTINGS_VERSION,
    PROVIDERS,
    DEFAULTS,
    isLegacyCustom,
    isUnsupportedProvider,
    requiresAiReset,
    resolveProvider,
    providerDefaults,
    normalizeBaseUrl,
    normalize,
    migrateLegacyCustom,
    chatCompletionsUrl,
    providerLabel,
    optionalOriginPattern,
    canonicalYouTubeUrl,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = YTD_SETTINGS;
}
