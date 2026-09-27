# layout-preview

A drop-in dev toolbar for checking responsive layouts at device sizes, right inside the page you're building. It has no dependencies, needs no framework, and only activates on local dev hosts.

- **Inline mode** narrows `<body>` in place. CSS container queries respond, and so does any JS that reads `LayoutPreview.width`. The page stays in the same document, so element pickers (Cursor, DevTools) still work.
- **Iframe mode** loads the page in a device-sized iframe, so the real viewport changes and ordinary `@media` queries respond.
- **Responsive** uses the real window. Resize the browser freely.
- Presets, a custom size, fit-to-window scaling, a device frame mask, a canvas background colour, and hiding the artboard scrollbar.
- State is saved per tab in `sessionStorage`. Toggle the panel with **Alt+Shift+L**.

## Install

Pick whichever fits the project.

### 1. Script tag (any site, no build step)

```html
<script src="https://cdn.jsdelivr.net/npm/layout-preview@1/dist/layout-preview.min.js" defer></script>
```

Before the package is published to npm, load it straight from GitHub instead (pin a tag or commit):

```html
<script src="https://cdn.jsdelivr.net/gh/chaxic/layout-preview@main/dist/layout-preview.min.js" defer></script>
```

If you want production to load nothing at all, only add the tag in dev templates, or vendor `dist/layout-preview.js` into the project and load it conditionally.

### 2. npm (Vite, Next.js, React, etc.)

```bash
npm i -D layout-preview
```

```js
if (import.meta.env.DEV) {
  import('layout-preview').then(({ init }) => init({ storageKey: 'my-app' }));
}
```

Or use zero-config auto-init, which reads `window.LayoutPreviewConfig` if it's set:

```js
if (import.meta.env.DEV) import('layout-preview/auto');
```

### 3. Browser extension (no project changes)

The Chrome/Edge extension in [`extension/`](extension/) injects the toolbar on `localhost`, `127.0.0.1` and `*.localhost` pages. See [extension/README.md](extension/README.md).

## Configuration

Pass options to `init({...})`, set `window.LayoutPreviewConfig = {...}` before the script tag, or use `data-*` attributes on the script tag.

| Option | Data attribute | Default | Notes |
| --- | --- | --- | --- |
| `presets` | `data-presets` | Desktop 1440, Laptop 1280, Tablet 1024/768, Mobile 390 | Array of `{ id?, label, width, height?, fillHeight? }`. Data attribute form: `"Phone=390x844, Wide=1600"` or JSON. |
| `defaultPreset` | `data-default-preset` | first sized preset | Preset id. |
| `mode` | `data-mode` | `'inline'` | `'inline'` or `'iframe'`. A mode the user picks in the toolbar is remembered. |
| `modeSwitch` | - | `true` | Set `false` to hide the Inline/Iframe switch. |
| `responsive` / `custom` | `data-responsive` / `data-custom` | `true` | Show the Responsive and Custom size buttons. |
| `storageKey` | `data-storage-key` | `'layout-preview'` | Prefix for `sessionStorage` keys. Use one per project. |
| `enableOn` | `data-enable-on` | local/private hosts | Host list (supports `*.example.dev`), RegExp, or `(hostname) => boolean`. |
| `force` | `data-force` | `false` | Skip the host check, e.g. for a staging preview. |
| `open` | `data-open` | `true` | Whether the panel starts open (after that, the last state is remembered). |
| `nonce` | `data-nonce` | script's `nonce` | Only used by the `<style>` fallback in browsers without constructable stylesheets. |
| `backgrounds` | - | grey / white / cream / dark | Array of `{ label, value: '#rrggbb' }`. |
| `mount` | - | `<html>` | Element to mount the toolbar into. |
| `shortcut` | - | `true` | Alt+Shift+L toggles the panel. |
| `onChange` | - | - | Callback with the same `detail` object as the change event. |

`fillHeight: true` on a preset (Desktop by default) makes fit-to-window scale to the window width and grow the artboard height to fill the window, rather than letterboxing.

Local/private hosts are `localhost`, `*.localhost`, `127.x.x.x`, `[::1]`, `10.x.x.x`, `192.168.x.x` and `172.16-31.x.x`.

## Reading the preview size from your code

Inline mode doesn't change `window.innerWidth`, so JS that picks layouts by width should ask the toolbar:

```js
function layoutWidth() {
  return (window.LayoutPreview && window.LayoutPreview.width) || window.innerWidth;
}

window.addEventListener('layoutpreview:change', (event) => {
  // event.detail = { width, height, mode, preset, scale } (width is null for Responsive)
});
```

The toolbar also sets `data-dev-layout-width` / `data-dev-layout-height` on `<html>` and the `--dev-layout-width` / `--dev-layout-height` CSS variables in inline mode. `window.__devLayoutWidth` is still set as a deprecated alias.

In iframe mode, the page inside the frame has a real viewport, so `window.innerWidth` and `matchMedia` are already correct there.

## JS API

```js
LayoutPreview.init(options)   // returns the controller (or the existing one)
LayoutPreview.destroy()
LayoutPreview.setPreset('mobile')
LayoutPreview.setMode('iframe')
LayoutPreview.open() / close() / toggle()
LayoutPreview.width / height / mode / preset / scale / active / version
```

## Which mode should I use?

| Your CSS uses | Use |
| --- | --- |
| Container queries (`@container`), or JS reading `LayoutPreview.width` | Inline |
| `@media (min-width: ...)` | Iframe |
| Both | Iframe for accuracy; Inline when you need element pickers |

Iframe mode needs the page to allow same-origin framing in dev. If your dev server sends `X-Frame-Options: DENY` or `frame-ancestors 'none'`, the toolbar shows a warning. Allow `'self'` in dev, or use Inline mode.

## Develop

```bash
npm install
npm test
npm run build      # dist/ + extension/layout-preview.js
npm run dev        # build, then serve the repo; open http://localhost:5173/demo/
```

## Security

This is a dev tool. It makes no network requests, collects no analytics, and runs no remote code or `eval`. It only writes to `sessionStorage`, and it stays inactive on public hosts unless you pass `force` or `enableOn`. See [SECURITY.md](SECURITY.md).

## License

MIT
