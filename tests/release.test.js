const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const blockedBrand = new RegExp(
  [
    `\\b${["T", "CL"].join("")}\\b`,
    `\\b${["Tur", "ing"].join("")}\\b`,
    `${[["tc", "l"].join(""), "jd"].join("")}`,
    `${["live", ["tur", "ing"].join("")].join("-")}`,
    `${["Field", "Lab"].join("\\\\s*")}`,
  ].join("|"),
  "i",
);

function walkTextFiles(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkTextFiles(fullPath));
    } else if (
      /\.(?:js|json|html|css|md|txt|yml|yaml|sh)$/i.test(entry.name) ||
      entry.name === "LICENSE"
    ) {
      found.push(fullPath);
    }
  }
  return found;
}

test("manifest exposes only the public provider routes", () => {
  const manifest = JSON.parse(read("manifest.json"));
  const packageJson = JSON.parse(read("package.json"));

  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.minimum_chrome_version, "116");
  assert.equal(manifest.name, "YouTube Digest - Flexible AI");
  assert.equal(packageJson.name, "youtube-digest-flexible-ai");
  assert.equal(packageJson.version, manifest.version);
  assert.equal(manifest.version, "1.3.0");
  assert.equal(manifest.options_ui.page, "options.html");
  assert.ok(!manifest.permissions.includes("activeTab"));
  assert.deepEqual(manifest.host_permissions, [
    "https://www.youtube.com/*",
    "https://api.supadata.ai/*",
    "https://api.deepseek.com/*",
  ]);
  assert.deepEqual(manifest.optional_host_permissions, ["https://*/*"]);
});

test("public documentation explains both routes and credits upstream", () => {
  const readme = read("README.md");
  const chineseReadme = read("README.zh-CN.md");
  const privacy = read("PRIVACY.md");
  const security = read("SECURITY.md");
  const notice = read("NOTICE.md");
  const docs = [readme, chineseReadme, privacy, security, notice].join("\n");

  assert.match(readme, /^# YouTube Digest - Flexible AI$/m);
  assert.match(readme, /independent community remix/i);
  assert.match(readme, /github\.com\/zarazhangrui\/youtube-digest/i);
  assert.match(readme, /x\.com\/zarazhangrui/i);
  assert.match(readme, /DeepSeek Official/);
  assert.match(readme, /Company OpenAI-compatible/);
  assert.match(readme, /runtime host-access prompt/i);
  assert.match(readme, /not an official release/i);
  assert.match(chineseReadme, /独立社区改编版/);
  assert.match(chineseReadme, /运行时域名权限/);
  assert.match(notice, /original MIT license and attribution are preserved/i);
  assert.match(read("LICENSE"), /Copyright \(c\) 2026 Zara Zhang/);
  assert.doesNotMatch(docs, blockedBrand);
});

test("Settings offers only DeepSeek and a user-approved company gateway", () => {
  const page = read("options.html");
  const script = read("options.js");
  const settings = read("settings.js");

  assert.match(page, /<option value="deepseek"/);
  assert.match(page, /<option value="custom"/);
  assert.equal((page.match(/<option value=/g) || []).length, 2);
  assert.match(page, /platform\.deepseek\.com\/api_keys/);
  assert.match(page, /id="testConnectionBtn"/);
  assert.match(script, /Company OpenAI-compatible/);
  assert.match(script, /permissions\.request/);
  assert.match(settings, /allowedOrigins: Object\.freeze\(\["https:\/\/api\.deepseek\.com"\]\)/);
  assert.match(settings, /url\.protocol !== "https:"/);
  assert.doesNotMatch([page, script, settings].join("\n"), blockedBrand);
});

test("unsupported stored providers are removed safely during migration", () => {
  const settings = require("../settings.js");
  const result = settings.migrateLegacyCustom({
    settingsVersion: 2,
    provider: "removed-provider",
    aiApiKey: "private-key",
    aiBaseUrl: "https://private.example/v1",
    aiModel: "private-model",
    supadataApiKey: "transcript-key",
  });

  assert.equal(result.migrated, true);
  assert.equal(result.settings.provider, "deepseek");
  assert.equal(result.settings.aiApiKey, "");
  assert.equal(result.settings.supadataApiKey, "transcript-key");
});

test("publishable source contains no blocked organization-specific branding", () => {
  const matches = [];
  for (const file of walkTextFiles(root)) {
    const source = fs.readFileSync(file, "utf8");
    if (blockedBrand.test(source)) {
      matches.push(path.relative(root, file));
    }
  }
  assert.deepEqual(matches, []);
});

test("release scripts use an explicit allowlist and include the remix notice", () => {
  const checkScript = read("scripts/check-release.sh");
  const packageScript = read("scripts/package-extension.sh");

  assert.match(checkScript, /public_allowlist=\(/);
  assert.match(checkScript, /"NOTICE\.md"/);
  assert.match(checkScript, /credential_scan_files/);
  assert.match(packageScript, /youtube-digest-flexible-ai-v\$version\.zip/);
  assert.doesNotMatch(packageScript, /git archive/);
});

test("runtime has no private config dependency and keeps provider rules isolated", () => {
  const runtime = [
    read("background.js"),
    read("settings.js"),
    read("options.js"),
  ].join("\n");

  assert.doesNotMatch(runtime, /importScripts\s*\(\s*["']config\.js/);
  assert.doesNotMatch(runtime, /(^|[^A-Za-z0-9_])CONFIG\./);
  assert.match(runtime, /settings\.provider === "deepseek"/);
  assert.match(runtime, /optionalOriginPattern/);
  assert.doesNotMatch(runtime, blockedBrand);
});

test("product UI contains no emoji or emoji-like pictographs", () => {
  const productUi = [
    read("sidepanel.html"),
    read("sidepanel.js"),
    read("content.js"),
    read("options.html"),
    read("options.js"),
  ].join("\n");

  assert.doesNotMatch(productUi, /\p{Extended_Pictographic}|[✓✕⧉▶]/u);
  assert.doesNotMatch(productUi, /&#(?:9655|9888);/);
});
