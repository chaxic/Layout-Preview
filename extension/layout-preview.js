/*! layout-preview v1.0.0 | MIT | https://github.com/chaxic/layout-preview */
(() => {
  // src/styles/toolbar.css
  var toolbar_default = ':host {\n  all: initial;\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2147483001;\n  display: block;\n  width: 300px;\n  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n  color: #06273a;\n  pointer-events: none;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n.panel,\n.toggle {\n  pointer-events: auto;\n}\n\n.panel {\n  background: #fffef8;\n  border: 1px solid rgba(6, 39, 58, 0.12);\n  border-radius: 8px;\n  box-shadow: 0 10px 15px rgba(6, 39, 58, 0.18);\n  padding: 10px 12px 12px;\n  margin-bottom: 8px;\n  max-height: min(70vh, 640px);\n  overflow: auto;\n}\n\n.title {\n  margin: 0 0 8px;\n  font-size: 12px;\n  line-height: 1.3;\n  font-weight: 600;\n}\n\n.hint,\n.width-label,\n.section-title,\n.field-label,\n.status {\n  margin: 0 0 8px;\n  font-size: 11px;\n  line-height: 1.3;\n  color: #62707a;\n}\n\n.buttons {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-bottom: 10px;\n}\n\n.btn,\n.seg {\n  appearance: none;\n  border: 1px solid rgba(6, 39, 58, 0.18);\n  border-radius: 6px;\n  background: #fff;\n  color: #06273a;\n  font: inherit;\n  font-size: 12px;\n  line-height: 1.25;\n  padding: 8px 10px;\n  cursor: pointer;\n  text-align: left;\n  width: 100%;\n  margin: 0;\n}\n\n.btn:hover,\n.seg:hover {\n  border-color: rgba(6, 39, 58, 0.35);\n}\n\n.btn:focus-visible,\n.seg:focus-visible,\n.toggle:focus-visible,\n.swatch:focus-visible {\n  outline: 2px solid #2b7bb9;\n  outline-offset: 2px;\n}\n\n.btn.is-active,\n.seg.is-active {\n  background: #06273a;\n  border-color: #06273a;\n  color: #fff;\n}\n\n.segmented {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 6px;\n}\n\n.seg {\n  text-align: center;\n  padding: 6px 8px;\n}\n\n.custom {\n  margin: 0 0 10px;\n}\n\n.custom-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.field-label {\n  margin: 0;\n}\n\n.input {\n  width: 100%;\n  border: 1px solid rgba(6, 39, 58, 0.18);\n  border-radius: 6px;\n  background: #fff;\n  color: #06273a;\n  font: inherit;\n  font-size: 12px;\n  line-height: 1.25;\n  padding: 7px 8px;\n}\n\n.input:focus {\n  outline: 2px solid rgba(6, 39, 58, 0.25);\n  outline-offset: 1px;\n}\n\n.section {\n  margin: 0 0 10px;\n}\n\n.section-title {\n  margin: 0 0 6px;\n}\n\n.bg-row {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n}\n\n.swatch {\n  appearance: none;\n  width: 28px;\n  height: 28px;\n  border: 1px solid rgba(6, 39, 58, 0.2);\n  border-radius: 6px;\n  padding: 0;\n  cursor: pointer;\n}\n\n.swatch.is-active {\n  outline: 2px solid #06273a;\n  outline-offset: 1px;\n}\n\n.picker {\n  width: 36px;\n  height: 28px;\n  padding: 0;\n  border: 1px solid rgba(6, 39, 58, 0.2);\n  border-radius: 6px;\n  background: #fff;\n  cursor: pointer;\n}\n\n.check {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 8px;\n  font-size: 11px;\n  line-height: 1.3;\n  cursor: pointer;\n}\n\n.check input {\n  width: 14px;\n  height: 14px;\n  margin: 0;\n  accent-color: #06273a;\n  cursor: pointer;\n}\n\n.check input:disabled,\n.check input:disabled + span {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.status {\n  margin: 0;\n  line-height: 1.35;\n}\n\n.status.is-warning {\n  color: #905d30;\n}\n\n.toggle {\n  display: block;\n  margin-left: auto;\n  width: fit-content;\n  appearance: none;\n  border: 1px solid rgba(6, 39, 58, 0.18);\n  border-radius: 999px;\n  background: #06273a;\n  color: #fff;\n  font: inherit;\n  font-size: 12px;\n  line-height: 1;\n  padding: 9px 12px;\n  cursor: pointer;\n  box-shadow: 0 8px 10px rgba(6, 39, 58, 0.2);\n}\n\n.toggle:hover {\n  background: #0a3550;\n}\n\n.toggle[aria-expanded="true"] {\n  background: #fff;\n  color: #06273a;\n}\n';

  // src/styles/document.css
  var document_default = '/* Document-level rules: inline artboard + iframe stage. */\n\nhtml[data-dev-layout-width] {\n  background: var(--dev-layout-bg, #d8dde1);\n  min-height: 100%;\n  overflow-x: auto;\n}\n\nhtml[data-dev-layout-width] body {\n  width: var(--dev-layout-width);\n  max-width: var(--dev-layout-width);\n  margin-inline: auto;\n  min-height: 100vh;\n  box-shadow: 0 0 0 1px rgba(6, 39, 58, 0.08);\n}\n\nhtml[data-dev-layout-height][data-dev-layout-width] body {\n  min-height: var(--dev-layout-height);\n  height: var(--dev-layout-height);\n  max-height: var(--dev-layout-height);\n  overflow: auto;\n  box-sizing: border-box;\n}\n\nhtml[data-dev-layout-fit="true"][data-dev-layout-width] {\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n\nhtml[data-dev-layout-fit="true"][data-dev-layout-width] body {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  margin: 0;\n  transform: translateX(-50%) scale(var(--dev-layout-scale, 1));\n  transform-origin: top center;\n}\n\nhtml[data-dev-layout-frame="true"][data-dev-layout-width] body {\n  border-radius: 24px;\n  overflow: hidden;\n  box-shadow:\n    0 0 0 10px #1a1a1a,\n    0 0 0 11px rgba(6, 39, 58, 0.12),\n    0 24px 48px rgba(6, 39, 58, 0.22);\n  margin-block: 24px;\n  min-height: calc(100vh - 48px);\n}\n\nhtml[data-dev-layout-frame="true"][data-dev-layout-height][data-dev-layout-width] body {\n  min-height: var(--dev-layout-height);\n  height: var(--dev-layout-height);\n  max-height: var(--dev-layout-height);\n  overflow: auto;\n  margin-block: 24px;\n}\n\nhtml[data-dev-layout-fit="true"][data-dev-layout-frame="true"][data-dev-layout-width] body {\n  top: 24px;\n  margin: 0;\n  transform: translateX(-50%) scale(var(--dev-layout-scale, 1));\n  transform-origin: top center;\n}\n\nhtml[data-dev-layout-hide-scrollbar="true"][data-dev-layout-height][data-dev-layout-width] body {\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n\nhtml[data-dev-layout-hide-scrollbar="true"][data-dev-layout-height][data-dev-layout-width] body::-webkit-scrollbar {\n  display: none;\n  width: 0;\n  height: 0;\n}\n\n/* Iframe mode */\n\nhtml[data-layout-preview-stage] {\n  overflow: hidden !important;\n}\n\nlayout-preview-stage {\n  position: fixed !important;\n  inset: 0 !important;\n  z-index: 2147483000 !important;\n  display: block !important;\n  overflow: auto !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  background: var(--dev-layout-bg, #d8dde1) !important;\n}\n\nlayout-preview-device {\n  display: block !important;\n  position: relative !important;\n  box-sizing: content-box !important;\n  width: var(--layout-preview-w) !important;\n  height: var(--layout-preview-h) !important;\n  margin: 12px auto !important;\n  padding: 0 !important;\n  background: #fff !important;\n  box-shadow: 0 0 0 1px rgba(6, 39, 58, 0.08) !important;\n}\n\nlayout-preview-stage[data-fit="true"] {\n  overflow: hidden !important;\n}\n\nlayout-preview-stage[data-fit="true"] layout-preview-device {\n  position: absolute !important;\n  top: 12px !important;\n  left: 50% !important;\n  margin: 0 !important;\n  transform: translateX(-50%) scale(var(--layout-preview-scale, 1)) !important;\n  transform-origin: top center !important;\n}\n\nlayout-preview-stage[data-frame="true"] layout-preview-device {\n  border-radius: 24px !important;\n  overflow: hidden !important;\n  box-shadow:\n    0 0 0 10px #1a1a1a,\n    0 0 0 11px rgba(6, 39, 58, 0.12),\n    0 24px 48px rgba(6, 39, 58, 0.22) !important;\n  margin: 35px auto !important;\n}\n\nlayout-preview-stage[data-fit="true"][data-frame="true"] layout-preview-device {\n  top: 35px !important;\n  margin: 0 !important;\n}\n\nlayout-preview-device iframe {\n  display: block !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-width: none !important;\n  max-height: none !important;\n  border: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  background: #fff !important;\n}\n';

  // src/iframe-mode.js
  var FRAME_NAME = "layout-preview-frame";
  function isPreviewFrame() {
    try {
      return window.name === FRAME_NAME && window.parent !== window;
    } catch (err) {
      return false;
    }
  }
  function createStage(hooks) {
    var root = document.documentElement;
    var stage = document.createElement("layout-preview-stage");
    var device = document.createElement("layout-preview-device");
    var frame = document.createElement("iframe");
    var hideScrollbar = false;
    var blocked = false;
    frame.name = FRAME_NAME;
    frame.title = "Layout preview frame";
    frame.setAttribute("loading", "eager");
    frame.src = window.location.href;
    function frameWindow() {
      try {
        var win = frame.contentWindow;
        void win.location.href;
        return win;
      } catch (err) {
        return null;
      }
    }
    function applyScrollbar() {
      var win = frameWindow();
      if (!win || !win.document || !win.document.documentElement) return;
      var html = win.document.documentElement;
      if (hideScrollbar) {
        html.style.setProperty("scrollbar-width", "none");
      } else {
        html.style.removeProperty("scrollbar-width");
      }
    }
    function onLoad() {
      var win = frameWindow();
      blocked = !win || /^(about:blank|chrome-error:)/.test(String(win.location.href));
      if (!blocked) {
        applyScrollbar();
        try {
          if (win.location.href !== window.location.href) {
            window.history.replaceState(window.history.state, "", win.location.href);
          }
          if (win.document.title) document.title = win.document.title;
        } catch (err) {
        }
      }
      if (hooks && hooks.onLoad) hooks.onLoad({ blocked });
    }
    frame.addEventListener("load", onLoad);
    device.appendChild(frame);
    stage.appendChild(device);
    root.appendChild(stage);
    root.setAttribute("data-layout-preview-stage", "true");
    return {
      update: function(params) {
        stage.style.setProperty("--layout-preview-w", params.width + "px");
        stage.style.setProperty("--layout-preview-h", params.height + "px");
        stage.style.setProperty("--layout-preview-scale", String(params.scale || 1));
        if (params.fit) stage.setAttribute("data-fit", "true");
        else stage.removeAttribute("data-fit");
        if (params.frame) stage.setAttribute("data-frame", "true");
        else stage.removeAttribute("data-frame");
        if (params.hideScrollbar !== hideScrollbar) {
          hideScrollbar = Boolean(params.hideScrollbar);
          applyScrollbar();
        }
      },
      isBlocked: function() {
        return blocked;
      },
      destroy: function() {
        frame.removeEventListener("load", onLoad);
        if (stage.parentNode) stage.parentNode.removeChild(stage);
        root.removeAttribute("data-layout-preview-stage");
      }
    };
  }

  // src/utils.js
  var MIN_SIZE = 200;
  var MAX_SIZE = 4e3;
  var DEFAULT_PRESETS = [
    { id: "desktop", label: "Desktop (1440x900)", width: 1440, height: 900, fillHeight: true },
    { id: "laptop", label: "Laptop (1280x800)", width: 1280, height: 800 },
    { id: "tablet-landscape", label: "Tablet Landscape (1024x768)", width: 1024, height: 768 },
    { id: "tablet-portrait", label: "Tablet Portrait (768x1024)", width: 768, height: 1024 },
    { id: "mobile", label: "Mobile (390x844)", width: 390, height: 844 }
  ];
  var DEFAULT_BACKGROUNDS = [
    { id: "grey", label: "Grey", value: "#d8dde1" },
    { id: "white", label: "White", value: "#ffffff" },
    { id: "cream", label: "Cream", value: "#fffef8" },
    { id: "dark", label: "Dark", value: "#1a1a1a" }
  ];
  var RESPONSIVE_ID = "responsive";
  var CUSTOM_ID = "custom";
  function isLocalDevHost(hostname) {
    if (!hostname) return false;
    var host = String(hostname).toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1") {
      return true;
    }
    if (/\.localhost$/.test(host)) return true;
    if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    return /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host);
  }
  function hostAllowed(hostname, enableOn) {
    if (typeof enableOn === "function") return Boolean(enableOn(hostname));
    if (Array.isArray(enableOn)) {
      return enableOn.some(function(entry) {
        if (entry instanceof RegExp) return entry.test(hostname);
        var pattern = String(entry).toLowerCase();
        var host = String(hostname || "").toLowerCase();
        if (pattern.indexOf("*.") === 0) {
          var suffix = pattern.slice(1);
          return host.length > suffix.length && host.slice(-suffix.length) === suffix;
        }
        return host === pattern;
      });
    }
    return isLocalDevHost(hostname);
  }
  function clampSize(value, fallback) {
    var n = parseInt(value, 10);
    if (!isFinite(n) || n < MIN_SIZE) return fallback;
    if (n > MAX_SIZE) return MAX_SIZE;
    return n;
  }
  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function normalizePresets(input, options) {
    var opts = options || {};
    var source = Array.isArray(input) && input.length ? input : DEFAULT_PRESETS;
    var seen = {};
    var list = [];
    if (opts.responsive !== false) {
      list.push({ id: RESPONSIVE_ID, label: "Responsive (window)", width: null, height: null, responsive: true });
      seen[RESPONSIVE_ID] = true;
    }
    source.forEach(function(raw, index) {
      if (!raw) return;
      var width = clampSize(raw.width, null);
      if (!width) return;
      var height = raw.height == null ? null : clampSize(raw.height, null);
      var id = raw.id ? slug(raw.id) : slug(raw.label || width + "x" + (height || "auto"));
      if (!id || seen[id]) id = "preset-" + index;
      seen[id] = true;
      list.push({
        id,
        label: raw.label || width + (height ? "x" + height : "px"),
        width,
        height,
        fillHeight: Boolean(raw.fillHeight)
      });
    });
    if (opts.custom !== false) {
      list.push({ id: CUSTOM_ID, label: "Custom size", width: null, height: null, custom: true });
    }
    return list;
  }
  function isHexColor(value) {
    return /^#[0-9a-fA-F]{6}$/.test(String(value || ""));
  }
  function computeFit(params) {
    var pad = params.pad == null ? 24 : params.pad;
    var frameExtraW = params.frame ? 22 : 0;
    var frameExtraH = params.frame ? 48 + 22 : 0;
    var availW = Math.max(120, params.viewportWidth - pad - frameExtraW);
    var availH = Math.max(120, params.viewportHeight - pad - frameExtraH);
    var scale;
    var height;
    if (params.fillHeight) {
      scale = Math.min(1, availW / params.width);
      height = Math.max(params.height, Math.ceil(availH / scale));
    } else {
      scale = Math.min(1, availW / params.width, availH / params.height);
      height = params.height;
    }
    if (scale > 0.995) scale = 1;
    return { scale, height };
  }
  function parseBool(value) {
    if (value === void 0) return void 0;
    if (value === "" || value === "true" || value === "1") return true;
    if (value === "false" || value === "0") return false;
    return void 0;
  }
  function parsePresetList(value) {
    if (!value) return void 0;
    var text = String(value).trim();
    if (text.charAt(0) === "[") {
      try {
        var parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : void 0;
      } catch (err) {
        return void 0;
      }
    }
    var list = [];
    text.split(",").forEach(function(part) {
      var item = part.trim();
      if (!item) return;
      var eq = item.lastIndexOf("=");
      var label = eq === -1 ? "" : item.slice(0, eq).trim();
      var dims = (eq === -1 ? item : item.slice(eq + 1)).trim();
      var match = dims.match(/^(\d+)(?:\s*[xX]\s*(\d+))?$/);
      if (!match) return;
      list.push({
        label: label || void 0,
        width: parseInt(match[1], 10),
        height: match[2] ? parseInt(match[2], 10) : null
      });
    });
    return list.length ? list : void 0;
  }
  function optionsFromDataset(dataset) {
    if (!dataset) return {};
    var out = {};
    if (dataset.mode === "inline" || dataset.mode === "iframe") out.mode = dataset.mode;
    if (dataset.storageKey) out.storageKey = dataset.storageKey;
    if (dataset.defaultPreset) out.defaultPreset = dataset.defaultPreset;
    if (dataset.nonce) out.nonce = dataset.nonce;
    if (dataset.enableOn) {
      out.enableOn = dataset.enableOn.split(",").map(function(s) {
        return s.trim();
      }).filter(Boolean);
    }
    var presets = parsePresetList(dataset.presets);
    if (presets) out.presets = presets;
    var force = parseBool(dataset.force);
    if (force !== void 0) out.force = force;
    var open = parseBool(dataset.open);
    if (open !== void 0) out.open = open;
    var responsive = parseBool(dataset.responsive);
    if (responsive !== void 0) out.responsive = responsive;
    var custom = parseBool(dataset.custom);
    if (custom !== void 0) out.custom = custom;
    return out;
  }

  // src/core.js
  var VERSION = true ? "1.0.0" : "dev";
  var CHANGE_EVENT = "layoutpreview:change";
  var MODES = ["inline", "iframe"];
  var current = null;
  function createStore(prefix) {
    function key(name) {
      return prefix + "-" + name;
    }
    return {
      get: function(name) {
        try {
          return window.sessionStorage.getItem(key(name));
        } catch (err) {
          return null;
        }
      },
      set: function(name, value) {
        try {
          window.sessionStorage.setItem(key(name), String(value));
        } catch (err) {
        }
      }
    };
  }
  function installSheet(target, cssText, nonce) {
    var doc = target.ownerDocument || target;
    var win = doc.defaultView || window;
    if ("adoptedStyleSheets" in target && typeof win.CSSStyleSheet === "function") {
      try {
        var sheet = new win.CSSStyleSheet();
        sheet.replaceSync(cssText);
        target.adoptedStyleSheets = target.adoptedStyleSheets.concat([sheet]);
        return function() {
          target.adoptedStyleSheets = target.adoptedStyleSheets.filter(function(s) {
            return s !== sheet;
          });
        };
      } catch (err) {
      }
    }
    var style = doc.createElement("style");
    if (nonce) style.nonce = nonce;
    style.textContent = cssText;
    var parent = target === doc ? doc.head || doc.documentElement : target;
    parent.appendChild(style);
    return function() {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function inactiveController(reason) {
    return {
      active: false,
      reason,
      width: null,
      height: null,
      mode: null,
      preset: null,
      scale: 1,
      setPreset: function() {
      },
      setMode: function() {
      },
      open: function() {
      },
      close: function() {
      },
      toggle: function() {
      },
      destroy: function() {
      }
    };
  }
  function getActive() {
    return current;
  }
  function destroy() {
    if (current) current.destroy();
  }
  function init(userOptions) {
    var options = userOptions || {};
    if (typeof window === "undefined" || typeof document === "undefined") {
      return inactiveController("no-dom");
    }
    if (isPreviewFrame()) {
      return inactiveController("preview-frame");
    }
    if (!options.force && !hostAllowed(window.location.hostname, options.enableOn)) {
      return inactiveController("host-not-allowed");
    }
    if (current) {
      if (current.source === "extension" && options.source !== "extension") {
        current.destroy();
      } else {
        return current;
      }
    }
    if (!document.body) {
      var pending = inactiveController("waiting-for-body");
      document.addEventListener("DOMContentLoaded", function() {
        init(options);
      }, { once: true });
      return pending;
    }
    return createController(options);
  }
  function createController(options) {
    var root = document.documentElement;
    var store = createStore(options.storageKey || "layout-preview");
    var presets = normalizePresets(options.presets, options);
    var backgrounds = Array.isArray(options.backgrounds) && options.backgrounds.length ? options.backgrounds : DEFAULT_BACKGROUNDS;
    var defaultBg = isHexColor(options.background) ? options.background : backgrounds[0].value;
    var allowModeSwitch = options.modeSwitch !== false;
    function firstSizedPreset() {
      for (var i = 0; i < presets.length; i += 1) {
        if (presets[i].width) return presets[i].id;
      }
      return presets[0].id;
    }
    function findPreset(id) {
      for (var i = 0; i < presets.length; i += 1) {
        if (presets[i].id === id) return presets[i];
      }
      return null;
    }
    var defaultPresetId = findPreset(options.defaultPreset) ? options.defaultPreset : firstSizedPreset();
    var storedMode = store.get("mode");
    var initialMode = MODES.indexOf(options.mode) !== -1 ? options.mode : "inline";
    if (allowModeSwitch && MODES.indexOf(storedMode) !== -1) initialMode = storedMode;
    var storedPanel = store.get("panel");
    var state = {
      presetId: findPreset(store.get("width")) ? store.get("width") : defaultPresetId,
      mode: initialMode,
      frame: store.get("frame") === "true",
      fit: store.get("fit") !== "false",
      panelOpen: storedPanel ? storedPanel !== "closed" : options.open !== false,
      bg: isHexColor(store.get("bg")) ? store.get("bg") : defaultBg,
      customWidth: clampSize(store.get("custom-w"), 1024),
      customHeight: clampSize(store.get("custom-h"), 768),
      hideScrollbar: store.get("hide-scrollbar") === "true",
      scale: 1,
      artboardWidth: null,
      artboardHeight: null,
      frameBlocked: false
    };
    var ui = {};
    var cleanups = [];
    var stage = null;
    var lastEmitted = "";
    var destroyed = false;
    cleanups.push(installSheet(document, document_default, options.nonce));
    function getPreset() {
      return findPreset(state.presetId) || findPreset(defaultPresetId) || presets[0];
    }
    function resolvedSize(preset) {
      if (preset.responsive) return { width: null, height: null };
      if (preset.custom) return { width: state.customWidth, height: state.customHeight };
      return { width: preset.width, height: preset.height };
    }
    function setInlineArtboard(width, height) {
      if (width) {
        root.setAttribute("data-dev-layout-width", String(width));
        root.style.setProperty("--dev-layout-width", width + "px");
      } else {
        root.removeAttribute("data-dev-layout-width");
        root.style.removeProperty("--dev-layout-width");
      }
      if (height) {
        root.setAttribute("data-dev-layout-height", String(height));
        root.style.setProperty("--dev-layout-height", height + "px");
      } else {
        root.removeAttribute("data-dev-layout-height");
        root.style.removeProperty("--dev-layout-height");
      }
      window.__devLayoutWidth = width || null;
      window.__devLayoutHeight = height || null;
    }
    function setInlineFlags(fit, frame, hideScrollbar, scale) {
      toggleAttr("data-dev-layout-fit", fit);
      toggleAttr("data-dev-layout-frame", frame);
      toggleAttr("data-dev-layout-hide-scrollbar", hideScrollbar);
      if (fit) root.style.setProperty("--dev-layout-scale", String(scale));
      else root.style.removeProperty("--dev-layout-scale");
    }
    function toggleAttr(name, on) {
      if (on) root.setAttribute(name, "true");
      else root.removeAttribute(name);
    }
    function clearInline() {
      setInlineArtboard(null, null);
      setInlineFlags(false, false, false, 1);
    }
    function removeStage() {
      if (stage) {
        stage.destroy();
        stage = null;
      }
      state.frameBlocked = false;
    }
    function update(opts) {
      if (destroyed) return;
      var preset = getPreset();
      var size = resolvedSize(preset);
      var hasSize = Boolean(size.width);
      var hasHeight = Boolean(size.width && size.height);
      var fit = state.fit && hasHeight;
      var frame = state.frame && hasSize;
      var hideScrollbar = state.hideScrollbar && hasHeight;
      var prevW = state.artboardWidth;
      var prevH = state.artboardHeight;
      var width = size.width;
      var height = size.height;
      var scale = 1;
      if (fit) {
        var result = computeFit({
          width: size.width,
          height: size.height,
          fillHeight: preset.fillHeight,
          frame,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        });
        scale = result.scale;
        height = result.height;
      }
      state.scale = scale;
      state.artboardWidth = width || null;
      state.artboardHeight = hasSize ? height || null : null;
      if (!hasSize) {
        clearInline();
        removeStage();
      } else if (state.mode === "iframe") {
        clearInline();
        if (!stage) {
          stage = createStage({
            onLoad: function(info) {
              state.frameBlocked = info.blocked;
              updateStatus();
            }
          });
        }
        stage.update({
          width,
          height: height || Math.max(MIN_SIZE, window.innerHeight - 24),
          scale,
          fit,
          frame,
          hideScrollbar
        });
      } else {
        removeStage();
        setInlineArtboard(width, height);
        setInlineFlags(fit, frame, hideScrollbar, scale);
      }
      root.style.setProperty("--dev-layout-bg", state.bg);
      syncUi(preset, size, hasSize, hasHeight);
      updateStatus();
      emitChange();
      if (state.mode === "inline" && (prevW !== state.artboardWidth || prevH !== state.artboardHeight || opts && opts.forceResize)) {
        window.dispatchEvent(new Event("resize"));
      }
    }
    function emitChange() {
      var detail = {
        width: state.artboardWidth,
        height: state.artboardHeight,
        mode: state.mode,
        preset: getPreset().id,
        scale: state.scale
      };
      var signature = JSON.stringify(detail);
      if (signature === lastEmitted) return;
      lastEmitted = signature;
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail }));
      if (typeof options.onChange === "function") options.onChange(detail);
    }
    function syncUi(preset, size, hasSize, hasHeight) {
      if (!ui.panel) return;
      Object.keys(ui.presetButtons).forEach(function(id) {
        var on = id === preset.id;
        ui.presetButtons[id].classList.toggle("is-active", on);
        ui.presetButtons[id].setAttribute("aria-pressed", on ? "true" : "false");
      });
      Object.keys(ui.modeButtons).forEach(function(mode) {
        var on = mode === state.mode;
        ui.modeButtons[mode].classList.toggle("is-active", on);
        ui.modeButtons[mode].setAttribute("aria-pressed", on ? "true" : "false");
      });
      ui.custom.hidden = !preset.custom;
      if (preset.custom) {
        ui.customWidth.value = String(size.width);
        ui.customHeight.value = String(size.height);
      }
      ui.fit.disabled = !hasHeight;
      ui.fit.checked = state.fit;
      ui.frame.disabled = !hasSize;
      ui.frame.checked = state.frame;
      ui.hideScrollbar.disabled = !hasHeight;
      ui.hideScrollbar.checked = state.hideScrollbar;
      if (ui.picker.value.toLowerCase() !== state.bg.toLowerCase()) ui.picker.value = state.bg;
      Object.keys(ui.bgButtons).forEach(function(value) {
        ui.bgButtons[value].classList.toggle("is-active", value.toLowerCase() === state.bg.toLowerCase());
      });
    }
    function updateStatus() {
      if (!ui.status) return;
      var preset = getPreset();
      var viewport = window.innerWidth + "x" + window.innerHeight;
      var text;
      var warning = false;
      if (!state.artboardWidth) {
        ui.widthLabel.textContent = "Window \xB7 " + window.innerWidth + " \xD7 " + window.innerHeight + "px";
        text = preset.responsive ? "Responsive \xB7 Viewport: " + viewport + " \xB7 Resize the window to test breakpoints" : "Viewport: " + viewport;
      } else {
        var dims = state.artboardWidth + "x" + (state.artboardHeight || "auto");
        ui.widthLabel.textContent = state.artboardWidth + (state.artboardHeight ? " x " + state.artboardHeight : "") + "px \xB7 " + state.mode;
        if (state.scale < 1) {
          text = "Artboard: " + dims + " \xB7 Fit " + Math.round(state.scale * 100) + "% \xB7 Window: " + viewport;
        } else {
          text = "Artboard: " + dims + " \xB7 Actual size \xB7 Window: " + viewport;
        }
        if (state.mode === "iframe" && state.frameBlocked) {
          warning = true;
          text = "This page refuses to be framed (X-Frame-Options / CSP frame-ancestors). Allow 'self' in dev, or use Inline mode.";
        }
      }
      ui.status.textContent = text;
      ui.status.classList.toggle("is-warning", warning);
    }
    function setPreset(id) {
      var preset = findPreset(id);
      if (!preset) return;
      state.presetId = preset.id;
      store.set("width", preset.id);
      update({ forceResize: true });
    }
    function setMode(mode) {
      if (MODES.indexOf(mode) === -1 || mode === state.mode) return;
      state.mode = mode;
      store.set("mode", mode);
      update({ forceResize: true });
    }
    function setPanelOpen(open) {
      state.panelOpen = Boolean(open);
      store.set("panel", state.panelOpen ? "open" : "closed");
      if (ui.panel) ui.panel.hidden = !state.panelOpen;
      if (ui.toggle) ui.toggle.setAttribute("aria-expanded", state.panelOpen ? "true" : "false");
    }
    function checkbox(label, title, checked, onChange) {
      var wrap = el("label", "check");
      if (title) wrap.title = title;
      var input = el("input");
      input.type = "checkbox";
      input.checked = checked;
      input.addEventListener("change", function() {
        onChange(input.checked);
      });
      wrap.appendChild(input);
      wrap.appendChild(el("span", null, label));
      return { wrap, input };
    }
    function numberInput(value, ariaLabel) {
      var input = el("input", "input");
      input.type = "number";
      input.min = String(MIN_SIZE);
      input.max = String(MAX_SIZE);
      input.step = "1";
      input.value = String(value);
      input.setAttribute("aria-label", ariaLabel);
      return input;
    }
    function mountToolbar() {
      var host = document.createElement("layout-preview-toolbar");
      host.setAttribute("data-version", VERSION);
      var shadow = host.attachShadow({ mode: "open" });
      cleanups.push(installSheet(shadow, toolbar_default, options.nonce));
      var region = el("div", "toolbar");
      region.setAttribute("role", "region");
      region.setAttribute("aria-label", "Layout preview");
      var panel = el("div", "panel");
      panel.id = "layout-preview-panel";
      panel.hidden = !state.panelOpen;
      panel.appendChild(el("p", "title", options.title || "Layout preview"));
      panel.appendChild(el("p", "hint", allowModeSwitch ? "Inline keeps the page in this tab (element pickers still work). Iframe gives a real viewport so @media queries respond." : "Pick a size to preview. Responsive uses the real window."));
      ui.widthLabel = el("p", "width-label");
      panel.appendChild(ui.widthLabel);
      ui.modeButtons = {};
      if (allowModeSwitch) {
        var modeSection = el("div", "section");
        modeSection.appendChild(el("p", "section-title", "Preview mode"));
        var seg = el("div", "segmented");
        [
          { id: "inline", label: "Inline", title: "Narrows <body>. Container queries and JS using LayoutPreview.width respond." },
          { id: "iframe", label: "Iframe", title: "Loads the page in a device-sized iframe. @media queries respond." }
        ].forEach(function(mode) {
          var btn = el("button", "seg", mode.label);
          btn.type = "button";
          btn.title = mode.title;
          btn.addEventListener("click", function() {
            setMode(mode.id);
          });
          ui.modeButtons[mode.id] = btn;
          seg.appendChild(btn);
        });
        modeSection.appendChild(seg);
        panel.appendChild(modeSection);
      }
      var buttons = el("div", "buttons");
      ui.presetButtons = {};
      presets.forEach(function(preset) {
        var btn = el("button", "btn", preset.label);
        btn.type = "button";
        btn.setAttribute("data-preset", preset.id);
        btn.addEventListener("click", function() {
          setPreset(preset.id);
        });
        ui.presetButtons[preset.id] = btn;
        buttons.appendChild(btn);
      });
      panel.appendChild(buttons);
      ui.custom = el("div", "custom");
      ui.custom.hidden = true;
      var customRow = el("div", "custom-row");
      ui.customWidth = numberInput(state.customWidth, "Custom width");
      ui.customHeight = numberInput(state.customHeight, "Custom height");
      [["Width", ui.customWidth], ["Height", ui.customHeight]].forEach(function(pair) {
        var field = el("label", "field");
        field.appendChild(el("span", "field-label", pair[0]));
        field.appendChild(pair[1]);
        customRow.appendChild(field);
      });
      ui.custom.appendChild(customRow);
      function onCustomChange() {
        state.customWidth = clampSize(ui.customWidth.value, state.customWidth);
        state.customHeight = clampSize(ui.customHeight.value, state.customHeight);
        store.set("custom-w", state.customWidth);
        store.set("custom-h", state.customHeight);
        setPreset("custom");
      }
      [ui.customWidth, ui.customHeight].forEach(function(input) {
        input.addEventListener("change", onCustomChange);
        input.addEventListener("keydown", function(event) {
          if (event.key === "Enter") onCustomChange();
        });
      });
      panel.appendChild(ui.custom);
      var bgSection = el("div", "section");
      bgSection.appendChild(el("p", "section-title", "Canvas background"));
      var bgRow = el("div", "bg-row");
      ui.bgButtons = {};
      function setBg(value) {
        state.bg = value;
        store.set("bg", value);
        update();
      }
      backgrounds.forEach(function(bg) {
        if (!isHexColor(bg.value)) return;
        var btn = el("button", "swatch");
        btn.type = "button";
        btn.title = bg.label || bg.value;
        btn.setAttribute("aria-label", "Canvas " + (bg.label || bg.value));
        btn.style.background = bg.value;
        btn.addEventListener("click", function() {
          setBg(bg.value);
        });
        ui.bgButtons[bg.value] = btn;
        bgRow.appendChild(btn);
      });
      ui.picker = el("input", "picker");
      ui.picker.type = "color";
      ui.picker.value = state.bg;
      ui.picker.setAttribute("aria-label", "Custom canvas colour");
      ui.picker.addEventListener("input", function() {
        setBg(ui.picker.value);
      });
      bgRow.appendChild(ui.picker);
      bgSection.appendChild(bgRow);
      panel.appendChild(bgSection);
      var fit = checkbox("Fit to window", "On: scale the artboard to fit the window. Off: actual pixel size.", state.fit, function(on) {
        state.fit = on;
        store.set("fit", on);
        update();
      });
      var frame = checkbox("Device frame mask", null, state.frame, function(on) {
        state.frame = on;
        store.set("frame", on);
        update();
      });
      var hideScrollbar = checkbox(
        "Hide artboard scrollbar",
        "Hide the artboard scrollbar so content uses the full preset width. Wheel/trackpad scrolling still works.",
        state.hideScrollbar,
        function(on) {
          state.hideScrollbar = on;
          store.set("hide-scrollbar", on);
          update({ forceResize: true });
        }
      );
      ui.fit = fit.input;
      ui.frame = frame.input;
      ui.hideScrollbar = hideScrollbar.input;
      panel.appendChild(fit.wrap);
      panel.appendChild(frame.wrap);
      panel.appendChild(hideScrollbar.wrap);
      ui.status = el("p", "status");
      ui.status.setAttribute("aria-live", "polite");
      panel.appendChild(ui.status);
      ui.toggle = el("button", "toggle", "Layout");
      ui.toggle.type = "button";
      ui.toggle.title = "Toggle layout preview (Alt+Shift+L)";
      ui.toggle.setAttribute("aria-expanded", state.panelOpen ? "true" : "false");
      ui.toggle.setAttribute("aria-controls", "layout-preview-panel");
      ui.toggle.addEventListener("click", function() {
        setPanelOpen(!state.panelOpen);
      });
      ui.panel = panel;
      region.appendChild(panel);
      region.appendChild(ui.toggle);
      shadow.appendChild(region);
      var mount = options.mount && options.mount.nodeType === 1 ? options.mount : root;
      mount.appendChild(host);
      cleanups.push(function() {
        if (host.parentNode) host.parentNode.removeChild(host);
      });
    }
    function listen(target, type, handler) {
      target.addEventListener(type, handler);
      cleanups.push(function() {
        target.removeEventListener(type, handler);
      });
    }
    var controller = {
      active: true,
      source: options.source || "page",
      version: VERSION,
      get width() {
        return state.artboardWidth;
      },
      get height() {
        return state.artboardHeight;
      },
      get mode() {
        return state.mode;
      },
      get preset() {
        return getPreset().id;
      },
      get scale() {
        return state.scale;
      },
      get presets() {
        return presets.slice();
      },
      setPreset,
      setMode,
      open: function() {
        setPanelOpen(true);
      },
      close: function() {
        setPanelOpen(false);
      },
      toggle: function() {
        setPanelOpen(!state.panelOpen);
      },
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        removeStage();
        clearInline();
        root.style.removeProperty("--dev-layout-bg");
        cleanups.splice(0).reverse().forEach(function(fn) {
          fn();
        });
        controller.active = false;
        if (current === controller) current = null;
        window.__devLayoutWidth = null;
        window.__devLayoutHeight = null;
        window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
          detail: { width: null, height: null, mode: null, preset: null, scale: 1 }
        }));
        window.dispatchEvent(new Event("resize"));
      }
    };
    current = controller;
    mountToolbar();
    listen(window, "resize", function(event) {
      if (event.isTrusted) update();
    });
    if (options.shortcut !== false) {
      listen(window, "keydown", function(event) {
        if (event.altKey && event.shiftKey && (event.key === "L" || event.key === "l" || event.code === "KeyL")) {
          event.preventDefault();
          setPanelOpen(!state.panelOpen);
        }
      });
    }
    update({ forceResize: true });
    return controller;
  }

  // src/index.js
  function activeValue(key, fallback) {
    var active = getActive();
    return active ? active[key] : fallback;
  }
  function publicInit(options) {
    var opts = options || {};
    if (typeof window !== "undefined") {
      var foreign = window.LayoutPreview;
      if (foreign && foreign !== LayoutPreview && foreign.active) {
        if (foreign.source === "extension" && opts.source !== "extension") {
          foreign.destroy();
        } else {
          return foreign;
        }
      }
    }
    var controller = init(opts);
    if (controller.active && typeof window !== "undefined") {
      window.LayoutPreview = LayoutPreview;
    }
    return controller;
  }
  var LayoutPreview = {
    version: VERSION,
    CHANGE_EVENT,
    DEFAULT_PRESETS,
    init: publicInit,
    destroy,
    isLocalDevHost,
    get active() {
      return Boolean(getActive());
    },
    get source() {
      return activeValue("source", null);
    },
    get width() {
      return activeValue("width", null);
    },
    get height() {
      return activeValue("height", null);
    },
    get mode() {
      return activeValue("mode", null);
    },
    get preset() {
      return activeValue("preset", null);
    },
    get scale() {
      return activeValue("scale", 1);
    },
    setPreset: function(id) {
      var active = getActive();
      if (active) active.setPreset(id);
    },
    setMode: function(mode) {
      var active = getActive();
      if (active) active.setMode(mode);
    },
    open: function() {
      var active = getActive();
      if (active) active.open();
    },
    close: function() {
      var active = getActive();
      if (active) active.close();
    },
    toggle: function() {
      var active = getActive();
      if (active) active.toggle();
    }
  };
  function installGlobal() {
    if (typeof window === "undefined") return LayoutPreview;
    var existing = window.LayoutPreview;
    if (existing && existing !== LayoutPreview && existing.active) {
      return existing;
    }
    window.LayoutPreview = LayoutPreview;
    return LayoutPreview;
  }
  installGlobal();
  var index_default = LayoutPreview;

  // src/iife.js
  installGlobal();
  var script = typeof document !== "undefined" ? document.currentScript : null;
  if (script && script.dataset.auto !== "false") {
    base = window.LayoutPreviewConfig || {};
    fromData = optionsFromDataset(script.dataset);
    merged = {};
    Object.keys(base).forEach(function(key) {
      merged[key] = base[key];
    });
    Object.keys(fromData).forEach(function(key) {
      merged[key] = fromData[key];
    });
    if (!merged.nonce && script.nonce) merged.nonce = script.nonce;
    index_default.init(merged);
  }
  var base;
  var fromData;
  var merged;
})();
