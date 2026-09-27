# Security Policy

## Scope and design

layout-preview is a development tool that runs inside your own pages.

- It is inactive unless the hostname is a loopback or private-network address, or the integrator explicitly passes `force` / `enableOn`.
- It makes no network requests, sends no telemetry, and loads no remote code. It does not use `eval`, `Function`, or `innerHTML`.
- It only persists UI preferences in `sessionStorage`, under the configured `storageKey`.
- Styles use constructable stylesheets, which are not subject to CSP `style-src`. The `<style>` fallback accepts a CSP `nonce`.
- Iframe mode loads the current same-origin URL. It never loads other origins.
- The browser extension only requests host access for `localhost`, `*.localhost` and `127.0.0.1`, plus `activeTab` for pages you click it on. It does not request `<all_urls>`, and it stores only the list of origins you switched off.

## Supported versions

Only the latest minor release gets fixes.

## Reporting a vulnerability

Please use GitHub's [private vulnerability reporting](https://github.com/chaxic/layout-preview/security/advisories/new) rather than opening a public issue. You should get a reply within a week.

## For contributors

Never commit tokens, `.env*` files, or credentials. npm publishing uses the `NPM_TOKEN` GitHub Actions secret, which never lives in the repository.
