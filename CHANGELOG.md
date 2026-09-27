# Changelog

## 1.0.0

- First standalone release, extracted from a site-specific dev toolbar.
- `init(options)` with configurable presets, host guard, storage prefix, backgrounds and mount point.
- Inline mode (narrows `<body>`; container queries respond) and a new iframe mode (real viewport; `@media` queries respond).
- Toolbar UI isolated in Shadow DOM, with CSS inlined into one JS file (constructable stylesheets, plus a `<style nonce>` fallback).
- `window.LayoutPreview` API and `layoutpreview:change` event; `window.__devLayoutWidth` kept as a deprecated alias.
- Script-tag auto-init with `data-*` options, ESM build, and `layout-preview/auto`.
- Chrome/Edge MV3 extension limited to localhost hosts.
- Fixed the private-network check so it no longer matches `172.0-15.x.x`.
