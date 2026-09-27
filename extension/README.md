# Layout Preview browser extension

This extension puts the layout-preview toolbar on local dev servers without changing any project code.

## Install (unpacked)

1. Run `npm install && npm run build` in the repo root. This copies `dist/layout-preview.js` into this folder.
2. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and select this `extension/` folder.

## Use

- Pages on `localhost`, `*.localhost` and `127.0.0.1` (any port) get the toolbar automatically once they load.
- Click the extension icon to turn it off or on for the current origin. The choice is remembered.
- For LAN addresses such as `192.168.x.x`, click the icon on the page. That grants temporary access to that tab only (`activeTab`).
- If a project loads its own copy of layout-preview, the project's configuration replaces the extension's instance.

## Permissions

| Permission | Why |
| --- | --- |
| `scripting` | Inject the toolbar bundle into the page. |
| `storage` | Remember origins you switched off. |
| `activeTab` | Allow a one-off injection on the tab you click, e.g. LAN IPs. |
| Host access to localhost / 127.0.0.1 | Auto-inject on local dev servers only. |

The extension never requests access to other websites.
