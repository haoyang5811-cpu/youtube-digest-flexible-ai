const test = require("node:test");
const assert = require("node:assert/strict");

const settings = require("../settings.js");

test("DeepSeek Official is the universal edition default", () => {
  const normalized = settings.normalize({
    aiApiKey: "  example-key  ",
    supadataApiKey: "  example-supadata  ",
  });

  assert.equal(normalized.settingsVersion, settings.SETTINGS_VERSION);
  assert.equal(normalized.provider, "deepseek");
  assert.equal(normalized.aiBaseUrl, "https://api.deepseek.com");
  assert.equal(normalized.aiModel, "deepseek-flash");
  assert.equal(normalized.aiApiKey, "example-key");
  assert.equal(normalized.supadataApiKey, "example-supadata");
  assert.equal(
    settings.chatCompletionsUrl(normalized),
    "https://api.deepseek.com/chat/completions",
  );
});

test("DeepSeek Official remains selectable with editable model and path", () => {
  const normalized = settings.normalize({
    provider: "deepseek",
    aiApiKey: " deepseek-key ",
    aiBaseUrl: "https://api.deepseek.com/v1/",
    aiModel: " deepseek-v4-pro ",
  });

  assert.equal(normalized.provider, "deepseek");
  assert.equal(normalized.aiBaseUrl, "https://api.deepseek.com/v1");
  assert.equal(normalized.aiModel, "deepseek-v4-pro");
  assert.equal(
    settings.chatCompletionsUrl(normalized),
    "https://api.deepseek.com/v1/chat/completions",
  );
});

test("provider keys cannot be redirected to another origin", () => {
  assert.throws(
    () =>
      settings.normalize({
        provider: "deepseek",
        aiBaseUrl: "https://example.com/v1",
        aiApiKey: "deepseek-key",
      }),
    /DeepSeek Official only accepts its documented official API domains/,
  );
});

test("company provider accepts only an explicit HTTPS origin", () => {
  const normalized = settings.normalize({
    settingsVersion: settings.SETTINGS_VERSION,
    provider: "custom",
    aiApiKey: " company-key ",
    aiBaseUrl: "https://gateway.company.example/api/v1/",
    aiModel: " company-model ",
  });

  assert.equal(normalized.provider, "custom");
  assert.equal(
    normalized.aiBaseUrl,
    "https://gateway.company.example/api/v1",
  );
  assert.equal(normalized.aiModel, "company-model");
  assert.equal(normalized.aiApiKey, "company-key");
  assert.equal(
    settings.chatCompletionsUrl(normalized),
    "https://gateway.company.example/api/v1/chat/completions",
  );
  assert.equal(
    settings.optionalOriginPattern(normalized),
    "https://gateway.company.example/*",
  );

  for (const aiBaseUrl of [
    "http://gateway.company.example/v1",
    "https://user:pass@gateway.company.example/v1",
    "https://gateway.company.example/v1?token=secret",
    "https://gateway.company.example/v1#fragment",
  ]) {
    assert.throws(
      () =>
        settings.normalize({
          settingsVersion: settings.SETTINGS_VERSION,
          provider: "custom",
          aiBaseUrl,
          aiModel: "company-model",
        }),
      /HTTPS|credentials|query|fragment/,
    );
  }
});

test("legacy custom migration clears only the AI key and is idempotent", () => {
  const first = settings.migrateLegacyCustom({
    provider: "custom",
    aiApiKey: "custom-secret",
    aiBaseUrl: "https://api.example.com/v1",
    aiModel: "example-model",
    supadataApiKey: " supadata-secret ",
  });

  assert.equal(first.migrated, true);
  assert.equal(first.settings.provider, "deepseek");
  assert.equal(first.settings.aiBaseUrl, settings.DEFAULTS.aiBaseUrl);
  assert.equal(first.settings.aiModel, settings.DEFAULTS.aiModel);
  assert.equal(first.settings.aiApiKey, "");
  assert.equal(first.settings.supadataApiKey, "supadata-secret");

  const second = settings.migrateLegacyCustom(first.settings);
  assert.equal(second.migrated, false);
  assert.deepEqual(second.settings, first.settings);
});

test("an unsupported provider is reset without retaining its credential", () => {
  const first = settings.migrateLegacyCustom({
    settingsVersion: 2,
    provider: "removed-provider",
    aiApiKey: "private-provider-key",
    aiBaseUrl: "https://private.example/api/v1",
    aiModel: "private-model",
    supadataApiKey: " supadata-secret ",
  });

  assert.equal(first.migrated, true);
  assert.equal(first.settings.provider, "deepseek");
  assert.equal(first.settings.aiBaseUrl, settings.DEFAULTS.aiBaseUrl);
  assert.equal(first.settings.aiModel, settings.DEFAULTS.aiModel);
  assert.equal(first.settings.aiApiKey, "");
  assert.equal(first.settings.supadataApiKey, "supadata-secret");
});

test("an existing DeepSeek configuration stays on DeepSeek", () => {
  const normalized = settings.normalize({
    provider: "deepseek",
    aiApiKey: "existing-key",
    aiBaseUrl: "https://api.deepseek.com",
    aiModel: "deepseek-v4-flash",
  });
  assert.equal(normalized.provider, "deepseek");
  assert.equal(normalized.aiApiKey, "existing-key");
});

test("Supadata receives a canonical YouTube URL", () => {
  assert.equal(
    settings.canonicalYouTubeUrl("ydTeb_I0b94"),
    "https://www.youtube.com/watch?v=ydTeb_I0b94",
  );
  assert.throws(
    () => settings.canonicalYouTubeUrl('\"><script>'),
    /Invalid YouTube video ID/,
  );
});
