import toolbarCss from './styles/toolbar.css';
import documentCss from './styles/document.css';
import { createStage, isPreviewFrame } from './iframe-mode.js';
import {
  DEFAULT_BACKGROUNDS,
  MAX_SIZE,
  MIN_SIZE,
  clampSize,
  computeFit,
  hostAllowed,
  isHexColor,
  normalizePresets,
} from './utils.js';

/* global __LAYOUT_PREVIEW_VERSION__ */
export var VERSION = typeof __LAYOUT_PREVIEW_VERSION__ === 'string' ? __LAYOUT_PREVIEW_VERSION__ : 'dev';
export var CHANGE_EVENT = 'layoutpreview:change';

var MODES = ['inline', 'iframe'];
var current = null;

function createStore(prefix) {
  function key(name) {
    return prefix + '-' + name;
  }
  return {
    get: function (name) {
      try {
        return window.sessionStorage.getItem(key(name));
      } catch (err) {
        return null;
      }
    },
    set: function (name, value) {
      try {
        window.sessionStorage.setItem(key(name), String(value));
      } catch (err) {
        /* storage unavailable (sandboxed / privacy mode) */
      }
    },
  };
}

/*
 * Constructable stylesheets are not subject to CSP style-src, so strict-CSP
 * sites work without a nonce; the <style> fallback accepts options.nonce.
 */
function installSheet(target, cssText, nonce) {
  var doc = target.ownerDocument || target;
  var win = doc.defaultView || window;
  if ('adoptedStyleSheets' in target && typeof win.CSSStyleSheet === 'function') {
    try {
      var sheet = new win.CSSStyleSheet();
      sheet.replaceSync(cssText);
      target.adoptedStyleSheets = target.adoptedStyleSheets.concat([sheet]);
      return function () {
        target.adoptedStyleSheets = target.adoptedStyleSheets.filter(function (s) {
          return s !== sheet;
        });
      };
    } catch (err) {
      /* fall through to <style> */
    }
  }
  var style = doc.createElement('style');
  if (nonce) style.nonce = nonce;
  style.textContent = cssText;
  var parent = target === doc ? doc.head || doc.documentElement : target;
  parent.appendChild(style);
  return function () {
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
    reason: reason,
    width: null,
    height: null,
    mode: null,
    preset: null,
    scale: 1,
    setPreset: function () {},
    setMode: function () {},
    open: function () {},
    close: function () {},
    toggle: function () {},
    destroy: function () {},
  };
}

export function getActive() {
  return current;
}

export function destroy() {
  if (current) current.destroy();
}

export function init(userOptions) {
  var options = userOptions || {};

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return inactiveController('no-dom');
  }
  if (isPreviewFrame()) {
    return inactiveController('preview-frame');
  }
  if (!options.force && !hostAllowed(window.location.hostname, options.enableOn)) {
    return inactiveController('host-not-allowed');
  }

  if (current) {
    /* A project's own config wins over the zero-config extension instance. */
    if (current.source === 'extension' && options.source !== 'extension') {
      current.destroy();
    } else {
      return current;
    }
  }

  if (!document.body) {
    var pending = inactiveController('waiting-for-body');
    document.addEventListener('DOMContentLoaded', function () {
      init(options);
    }, { once: true });
    return pending;
  }

  return createController(options);
}

function createController(options) {
  var root = document.documentElement;
  var store = createStore(options.storageKey || 'layout-preview');
  var presets = normalizePresets(options.presets, options);
  var backgrounds = Array.isArray(options.backgrounds) && options.backgrounds.length
    ? options.backgrounds
    : DEFAULT_BACKGROUNDS;
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
  var storedMode = store.get('mode');
  var initialMode = MODES.indexOf(options.mode) !== -1 ? options.mode : 'inline';
  if (allowModeSwitch && MODES.indexOf(storedMode) !== -1) initialMode = storedMode;

  var storedPanel = store.get('panel');
  var state = {
    presetId: findPreset(store.get('width')) ? store.get('width') : defaultPresetId,
    mode: initialMode,
    frame: store.get('frame') === 'true',
    fit: store.get('fit') !== 'false',
    panelOpen: storedPanel ? storedPanel !== 'closed' : options.open !== false,
    bg: isHexColor(store.get('bg')) ? store.get('bg') : defaultBg,
    customWidth: clampSize(store.get('custom-w'), 1024),
    customHeight: clampSize(store.get('custom-h'), 768),
    hideScrollbar: store.get('hide-scrollbar') === 'true',
    scale: 1,
    artboardWidth: null,
    artboardHeight: null,
    frameBlocked: false,
  };

  var ui = {};
  var cleanups = [];
  var stage = null;
  var lastEmitted = '';
  var destroyed = false;

  cleanups.push(installSheet(document, documentCss, options.nonce));

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
      root.setAttribute('data-dev-layout-width', String(width));
      root.style.setProperty('--dev-layout-width', width + 'px');
    } else {
      root.removeAttribute('data-dev-layout-width');
      root.style.removeProperty('--dev-layout-width');
    }
    if (height) {
      root.setAttribute('data-dev-layout-height', String(height));
      root.style.setProperty('--dev-layout-height', height + 'px');
    } else {
      root.removeAttribute('data-dev-layout-height');
      root.style.removeProperty('--dev-layout-height');
    }
    window.__devLayoutWidth = width || null;
    window.__devLayoutHeight = height || null;
  }

  function setInlineFlags(fit, frame, hideScrollbar, scale) {
    toggleAttr('data-dev-layout-fit', fit);
    toggleAttr('data-dev-layout-frame', frame);
    toggleAttr('data-dev-layout-hide-scrollbar', hideScrollbar);
    if (fit) root.style.setProperty('--dev-layout-scale', String(scale));
    else root.style.removeProperty('--dev-layout-scale');
  }

  function toggleAttr(name, on) {
    if (on) root.setAttribute(name, 'true');
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
        frame: frame,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
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
    } else if (state.mode === 'iframe') {
      clearInline();
      if (!stage) {
        stage = createStage({
          onLoad: function (info) {
            state.frameBlocked = info.blocked;
            updateStatus();
          },
        });
      }
      stage.update({
        width: width,
        height: height || Math.max(MIN_SIZE, window.innerHeight - 24),
        scale: scale,
        fit: fit,
        frame: frame,
        hideScrollbar: hideScrollbar,
      });
    } else {
      removeStage();
      setInlineArtboard(width, height);
      setInlineFlags(fit, frame, hideScrollbar, scale);
    }

    root.style.setProperty('--dev-layout-bg', state.bg);
    syncUi(preset, size, hasSize, hasHeight);
    updateStatus();
    emitChange();

    if (state.mode === 'inline' && (prevW !== state.artboardWidth || prevH !== state.artboardHeight || (opts && opts.forceResize))) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  function emitChange() {
    var detail = {
      width: state.artboardWidth,
      height: state.artboardHeight,
      mode: state.mode,
      preset: getPreset().id,
      scale: state.scale,
    };
    var signature = JSON.stringify(detail);
    if (signature === lastEmitted) return;
    lastEmitted = signature;
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: detail }));
    if (typeof options.onChange === 'function') options.onChange(detail);
  }

  function syncUi(preset, size, hasSize, hasHeight) {
    if (!ui.panel) return;
    Object.keys(ui.presetButtons).forEach(function (id) {
      var on = id === preset.id;
      ui.presetButtons[id].classList.toggle('is-active', on);
      ui.presetButtons[id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Object.keys(ui.modeButtons).forEach(function (mode) {
      var on = mode === state.mode;
      ui.modeButtons[mode].classList.toggle('is-active', on);
      ui.modeButtons[mode].setAttribute('aria-pressed', on ? 'true' : 'false');
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
    Object.keys(ui.bgButtons).forEach(function (value) {
      ui.bgButtons[value].classList.toggle('is-active', value.toLowerCase() === state.bg.toLowerCase());
    });
  }

  function updateStatus() {
    if (!ui.status) return;
    var preset = getPreset();
    var viewport = window.innerWidth + 'x' + window.innerHeight;
    var text;
    var warning = false;

    if (!state.artboardWidth) {
      ui.widthLabel.textContent = 'Window · ' + window.innerWidth + ' × ' + window.innerHeight + 'px';
      text = preset.responsive
        ? 'Responsive · Viewport: ' + viewport + ' · Resize the window to test breakpoints'
        : 'Viewport: ' + viewport;
    } else {
      var dims = state.artboardWidth + 'x' + (state.artboardHeight || 'auto');
      ui.widthLabel.textContent = state.artboardWidth + (state.artboardHeight ? ' x ' + state.artboardHeight : '') + 'px · ' + state.mode;
      if (state.scale < 1) {
        text = 'Artboard: ' + dims + ' · Fit ' + Math.round(state.scale * 100) + '% · Window: ' + viewport;
      } else {
        text = 'Artboard: ' + dims + ' · Actual size · Window: ' + viewport;
      }
      if (state.mode === 'iframe' && state.frameBlocked) {
        warning = true;
        text = 'This page refuses to be framed (X-Frame-Options / CSP frame-ancestors). Allow \'self\' in dev, or use Inline mode.';
      }
    }
    ui.status.textContent = text;
    ui.status.classList.toggle('is-warning', warning);
  }

  function setPreset(id) {
    var preset = findPreset(id);
    if (!preset) return;
    state.presetId = preset.id;
    store.set('width', preset.id);
    update({ forceResize: true });
  }

  function setMode(mode) {
    if (MODES.indexOf(mode) === -1 || mode === state.mode) return;
    state.mode = mode;
    store.set('mode', mode);
    update({ forceResize: true });
  }

  function setPanelOpen(open) {
    state.panelOpen = Boolean(open);
    store.set('panel', state.panelOpen ? 'open' : 'closed');
    if (ui.panel) ui.panel.hidden = !state.panelOpen;
    if (ui.toggle) ui.toggle.setAttribute('aria-expanded', state.panelOpen ? 'true' : 'false');
  }

  function checkbox(label, title, checked, onChange) {
    var wrap = el('label', 'check');
    if (title) wrap.title = title;
    var input = el('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.addEventListener('change', function () {
      onChange(input.checked);
    });
    wrap.appendChild(input);
    wrap.appendChild(el('span', null, label));
    return { wrap: wrap, input: input };
  }

  function numberInput(value, ariaLabel) {
    var input = el('input', 'input');
    input.type = 'number';
    input.min = String(MIN_SIZE);
    input.max = String(MAX_SIZE);
    input.step = '1';
    input.value = String(value);
    input.setAttribute('aria-label', ariaLabel);
    return input;
  }

  function mountToolbar() {
    var host = document.createElement('layout-preview-toolbar');
    host.setAttribute('data-version', VERSION);
    var shadow = host.attachShadow({ mode: 'open' });
    cleanups.push(installSheet(shadow, toolbarCss, options.nonce));

    var region = el('div', 'toolbar');
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Layout preview');

    var panel = el('div', 'panel');
    panel.id = 'layout-preview-panel';
    panel.hidden = !state.panelOpen;

    panel.appendChild(el('p', 'title', options.title || 'Layout preview'));
    panel.appendChild(el('p', 'hint', allowModeSwitch
      ? 'Inline keeps the page in this tab (element pickers still work). Iframe gives a real viewport so @media queries respond.'
      : 'Pick a size to preview. Responsive uses the real window.'));

    ui.widthLabel = el('p', 'width-label');
    panel.appendChild(ui.widthLabel);

    ui.modeButtons = {};
    if (allowModeSwitch) {
      var modeSection = el('div', 'section');
      modeSection.appendChild(el('p', 'section-title', 'Preview mode'));
      var seg = el('div', 'segmented');
      [
        { id: 'inline', label: 'Inline', title: 'Narrows <body>. Container queries and JS using LayoutPreview.width respond.' },
        { id: 'iframe', label: 'Iframe', title: 'Loads the page in a device-sized iframe. @media queries respond.' },
      ].forEach(function (mode) {
        var btn = el('button', 'seg', mode.label);
        btn.type = 'button';
        btn.title = mode.title;
        btn.addEventListener('click', function () {
          setMode(mode.id);
        });
        ui.modeButtons[mode.id] = btn;
        seg.appendChild(btn);
      });
      modeSection.appendChild(seg);
      panel.appendChild(modeSection);
    }

    var buttons = el('div', 'buttons');
    ui.presetButtons = {};
    presets.forEach(function (preset) {
      var btn = el('button', 'btn', preset.label);
      btn.type = 'button';
      btn.setAttribute('data-preset', preset.id);
      btn.addEventListener('click', function () {
        setPreset(preset.id);
      });
      ui.presetButtons[preset.id] = btn;
      buttons.appendChild(btn);
    });
    panel.appendChild(buttons);

    ui.custom = el('div', 'custom');
    ui.custom.hidden = true;
    var customRow = el('div', 'custom-row');
    ui.customWidth = numberInput(state.customWidth, 'Custom width');
    ui.customHeight = numberInput(state.customHeight, 'Custom height');
    [['Width', ui.customWidth], ['Height', ui.customHeight]].forEach(function (pair) {
      var field = el('label', 'field');
      field.appendChild(el('span', 'field-label', pair[0]));
      field.appendChild(pair[1]);
      customRow.appendChild(field);
    });
    ui.custom.appendChild(customRow);
    function onCustomChange() {
      state.customWidth = clampSize(ui.customWidth.value, state.customWidth);
      state.customHeight = clampSize(ui.customHeight.value, state.customHeight);
      store.set('custom-w', state.customWidth);
      store.set('custom-h', state.customHeight);
      setPreset('custom');
    }
    [ui.customWidth, ui.customHeight].forEach(function (input) {
      input.addEventListener('change', onCustomChange);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') onCustomChange();
      });
    });
    panel.appendChild(ui.custom);

    var bgSection = el('div', 'section');
    bgSection.appendChild(el('p', 'section-title', 'Canvas background'));
    var bgRow = el('div', 'bg-row');
    ui.bgButtons = {};
    function setBg(value) {
      state.bg = value;
      store.set('bg', value);
      update();
    }
    backgrounds.forEach(function (bg) {
      if (!isHexColor(bg.value)) return;
      var btn = el('button', 'swatch');
      btn.type = 'button';
      btn.title = bg.label || bg.value;
      btn.setAttribute('aria-label', 'Canvas ' + (bg.label || bg.value));
      btn.style.background = bg.value;
      btn.addEventListener('click', function () {
        setBg(bg.value);
      });
      ui.bgButtons[bg.value] = btn;
      bgRow.appendChild(btn);
    });
    ui.picker = el('input', 'picker');
    ui.picker.type = 'color';
    ui.picker.value = state.bg;
    ui.picker.setAttribute('aria-label', 'Custom canvas colour');
    ui.picker.addEventListener('input', function () {
      setBg(ui.picker.value);
    });
    bgRow.appendChild(ui.picker);
    bgSection.appendChild(bgRow);
    panel.appendChild(bgSection);

    var fit = checkbox('Fit to window', 'On: scale the artboard to fit the window. Off: actual pixel size.', state.fit, function (on) {
      state.fit = on;
      store.set('fit', on);
      update();
    });
    var frame = checkbox('Device frame mask', null, state.frame, function (on) {
      state.frame = on;
      store.set('frame', on);
      update();
    });
    var hideScrollbar = checkbox(
      'Hide artboard scrollbar',
      'Hide the artboard scrollbar so content uses the full preset width. Wheel/trackpad scrolling still works.',
      state.hideScrollbar,
      function (on) {
        state.hideScrollbar = on;
        store.set('hide-scrollbar', on);
        update({ forceResize: true });
      }
    );
    ui.fit = fit.input;
    ui.frame = frame.input;
    ui.hideScrollbar = hideScrollbar.input;
    panel.appendChild(fit.wrap);
    panel.appendChild(frame.wrap);
    panel.appendChild(hideScrollbar.wrap);

    ui.status = el('p', 'status');
    ui.status.setAttribute('aria-live', 'polite');
    panel.appendChild(ui.status);

    ui.toggle = el('button', 'toggle', 'Layout');
    ui.toggle.type = 'button';
    ui.toggle.title = 'Toggle layout preview (Alt+Shift+L)';
    ui.toggle.setAttribute('aria-expanded', state.panelOpen ? 'true' : 'false');
    ui.toggle.setAttribute('aria-controls', 'layout-preview-panel');
    ui.toggle.addEventListener('click', function () {
      setPanelOpen(!state.panelOpen);
    });

    ui.panel = panel;
    region.appendChild(panel);
    region.appendChild(ui.toggle);
    shadow.appendChild(region);

    /* Mount on <html>, not <body>: a body container-query root or transformed
       body would trap position:fixed inside the preview column. */
    var mount = options.mount && options.mount.nodeType === 1 ? options.mount : root;
    mount.appendChild(host);
    cleanups.push(function () {
      if (host.parentNode) host.parentNode.removeChild(host);
    });
  }

  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    cleanups.push(function () {
      target.removeEventListener(type, handler);
    });
  }

  var controller = {
    active: true,
    source: options.source || 'page',
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
    setPreset: setPreset,
    setMode: setMode,
    open: function () {
      setPanelOpen(true);
    },
    close: function () {
      setPanelOpen(false);
    },
    toggle: function () {
      setPanelOpen(!state.panelOpen);
    },
    destroy: function () {
      if (destroyed) return;
      destroyed = true;
      removeStage();
      clearInline();
      root.style.removeProperty('--dev-layout-bg');
      cleanups.splice(0).reverse().forEach(function (fn) {
        fn();
      });
      controller.active = false;
      if (current === controller) current = null;
      window.__devLayoutWidth = null;
      window.__devLayoutHeight = null;
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
        detail: { width: null, height: null, mode: null, preset: null, scale: 1 },
      }));
      window.dispatchEvent(new Event('resize'));
    },
  };

  current = controller;
  mountToolbar();

  listen(window, 'resize', function (event) {
    if (event.isTrusted) update();
  });
  if (options.shortcut !== false) {
    listen(window, 'keydown', function (event) {
      if (event.altKey && event.shiftKey && (event.key === 'L' || event.key === 'l' || event.code === 'KeyL')) {
        event.preventDefault();
        setPanelOpen(!state.panelOpen);
      }
    });
  }

  update({ forceResize: true });
  return controller;
}
