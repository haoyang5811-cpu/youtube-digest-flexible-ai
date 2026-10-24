# YouTube Digest - Flexible AI

把 YouTube 视频整理成可深入学习的资料，包括字幕、双语翻译、AI 概览、内容讲解和笔记。

本仓库是 [Zara Zhang 的 YouTube Digest](https://github.com/zarazhangrui/youtube-digest) 的独立社区改编版，不代表上游作者或任何 AI 服务商的官方发布或背书。项目保留了原始 MIT 许可证与署名。

[English](README.md)

## 选择配置路线

| 路线 | 适合谁 | 需要提供 |
| --- | --- | --- |
| DeepSeek Official | 使用个人账号的用户 | DeepSeek API Key |
| Company OpenAI-compatible | 已获准使用公司 AI 网关的用户 | HTTPS Base URL、Model ID 和 Token |

两条路线都需要 Supadata API Key 来获取视频字幕。Supadata 与 AI 用量分别由对应服务商计费。

## 主要功能

- 在视频旁阅读完整字幕。
- 将字幕片段翻译为英文或简体中文。
- 生成结构化概览与内容讲解。
- 保存带时间戳的笔记，并用 AI 润色。
- 将笔记导出为 Markdown。
- 将服务商设置保存在本地 Chrome 扩展存储中。
- 在真实使用前测试 AI 连接。

## 手动安装

1. 下载并解压 Release ZIP 到一个长期保留的文件夹。
2. 打开 `chrome://extensions`。
3. 开启“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择包含 `manifest.json` 的解压目录。
6. 保留该文件夹。移动或删除后，需要从新位置重新加载扩展。

需要时可把扩展固定到工具栏。在 YouTube 视频页点击 **Digest** 打开侧边栏。

## 配置字幕服务

1. 在 [Supadata](https://dash.supadata.ai/auth/sign-up) 创建账号。
2. 复制 API Key。
3. 打开 YouTube Digest Settings，将 Key 填入 **Supadata API key**。

扩展通过 Supadata 的 [Get Transcript API](https://docs.supadata.ai/get-transcript) 获取字幕，请求原始字幕时会强制使用 `mode=native`。估算用量前请查看 [Supadata 价格页面](https://supadata.ai/pricing)。

## 路线一：DeepSeek Official

1. 在 [DeepSeek API Keys 页面](https://platform.deepseek.com/api_keys)创建 Key。
2. 在 Settings 中选择 **DeepSeek Official**。
3. 保留默认 Base URL `https://api.deepseek.com`，或使用同一官方域名下的其他官方路径。
4. 填写受支持的 Model ID 和 API Key。
5. 点击 **Test Connection**，确认显示的请求地址后保存。

此版本默认使用 `deepseek-flash`。模型与价格可能变化，充值前请查看实时的 [DeepSeek 模型与价格页面](https://api-docs.deepseek.com/quick_start/pricing/)。

## 路线二：Company OpenAI-compatible 网关

只有在你的组织已经批准该网关，并允许把视频字幕及相关上下文发送给它时，才使用此路线。

1. 在 Settings 中选择 **Company OpenAI-compatible**。
2. 填写获准使用的 HTTPS Base URL。
3. 填写组织提供的准确 Model ID 和 Token。
4. 批准 Chrome 针对该准确来源显示的运行时域名权限。
5. 点击 **Test Connection**，确认请求地址后保存。

兼容要求：

- 仅支持 HTTPS，URL 不能包含内嵌账号密码、查询参数或片段。
- 使用 `Authorization` Header 中的 Bearer 认证。
- 提供 OpenAI-compatible 的 `POST /chat/completions` 接口。
- 返回内容能够从 `choices[0].message.content` 读取。

如果网关需要 OAuth、自定义认证 Header、Azure 风格的 `api-version` 参数，或服务商专属的非 OpenAI 请求格式，就需要修改代码。

## 隐私与安全

- API Key 由用户在 Settings 中输入，并保存到本地 Chrome 扩展存储。
- 本仓库和 Release 包不包含任何 API Key。
- DeepSeek Key 仅可发送到 `api.deepseek.com`。
- 自定义请求只会发送到你填写并在 Chrome 中批准的 HTTPS 来源。
- 使用 AI 功能时，所选服务商会收到视频字幕及相关上下文。
- 连接测试会显示服务商、模型与请求地址，不会显示 Key。

使用前请阅读 [PRIVACY.md](PRIVACY.md) 与 [SECURITY.md](SECURITY.md)。公司用户仍需自行遵守组织的数据处理、可接受使用与 AI 政策。

## 常见问题

### YouTube 视频页面没有显示 Digest 按钮

- 确认当前页面是 `youtube.com/watch`。
- 在 `chrome://extensions` 重新加载扩展。
- 刷新视频页面。

### 字幕加载失败

- 确认 Supadata Key 有效。
- 检查视频是否有可用字幕。
- 查看 Supadata 额度与服务状态。

### AI 请求失败

- 在 Settings 中使用 **Test Connection**。
- 确认 Base URL、Model ID 与 Key 属于所选路线。
- 使用公司网关时，确认已批准运行时域名权限。
- 向网关管理员确认其满足上述兼容要求。

## 本地验证

```bash
npm test
npm run check
npm run package
```

打包后的扩展位于 `dist/`。真实服务商连接需要用户自己的有效凭据，自动化测试不会执行这一步。

## 署名与许可证

本社区改编版基于 [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest)。感谢 [@zarazhangrui](https://x.com/zarazhangrui) 创建并开源原项目。

项目采用 [MIT License](LICENSE)。社区改编说明见 [NOTICE.md](NOTICE.md)。
