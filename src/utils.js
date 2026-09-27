export var MIN_SIZE = 200;
export var MAX_SIZE = 4000;

export var DEFAULT_PRESETS = [
  { id: 'desktop', label: 'Desktop (1440x900)', width: 1440, height: 900, fillHeight: true },
  { id: 'laptop', label: 'Laptop (1280x800)', width: 1280, height: 800 },
  { id: 'tablet-landscape', label: 'Tablet Landscape (1024x768)', width: 1024, height: 768 },
  { id: 'tablet-portrait', label: 'Tablet Portrait (768x1024)', width: 768, height: 1024 },
  { id: 'mobile', label: 'Mobile (390x844)', width: 390, height: 844 },
];

export var DEFAULT_BACKGROUNDS = [
  { id: 'grey', label: 'Grey', value: '#d8dde1' },
  { id: 'white', label: 'White', value: '#ffffff' },
  { id: 'cream', label: 'Cream', value: '#fffef8' },
  { id: 'dark', label: 'Dark', value: '#1a1a1a' },
];

export var RESPONSIVE_ID = 'responsive';
export var CUSTOM_ID = 'custom';

export function isLocalDevHost(hostname) {
  if (!hostname) return false;
  var host = String(hostname).toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1') {
    return true;
  }
  if (/\.localhost$/.test(host)) return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host);
}

export function hostAllowed(hostname, enableOn) {
  if (typeof enableOn === 'function') return Boolean(enableOn(hostname));
  if (Array.isArray(enableOn)) {
    return enableOn.some(function (entry) {
      if (entry instanceof RegExp) return entry.test(hostname);
      var pattern = String(entry).toLowerCase();
      var host = String(hostname || '').toLowerCase();
      if (pattern.indexOf('*.') === 0) {
        var suffix = pattern.slice(1);
        return host.length > suffix.length && host.slice(-suffix.length) === suffix;
      }
      return host === pattern;
    });
  }
  return isLocalDevHost(hostname);
}

export function clampSize(value, fallback) {
  var n = parseInt(value, 10);
  if (!isFinite(n) || n < MIN_SIZE) return fallback;
  if (n > MAX_SIZE) return MAX_SIZE;
  return n;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizePresets(input, options) {
  var opts = options || {};
  var source = Array.isArray(input) && input.length ? input : DEFAULT_PRESETS;
  var seen = {};
  var list = [];

  if (opts.responsive !== false) {
    list.push({ id: RESPONSIVE_ID, label: 'Responsive (window)', width: null, height: null, responsive: true });
    seen[RESPONSIVE_ID] = true;
  }

  source.forEach(function (raw, index) {
    if (!raw) return;
    var width = clampSize(raw.width, null);
    if (!width) return;
    var height = raw.height == null ? null : clampSize(raw.height, null);
    var id = raw.id ? slug(raw.id) : slug(raw.label || width + 'x' + (height || 'auto'));
    if (!id || seen[id]) id = 'preset-' + index;
    seen[id] = true;
    list.push({
      id: id,
      label: raw.label || width + (height ? 'x' + height : 'px'),
      width: width,
      height: height,
      fillHeight: Boolean(raw.fillHeight),
    });
  });

  if (opts.custom !== false) {
    list.push({ id: CUSTOM_ID, label: 'Custom size', width: null, height: null, custom: true });
  }

  return list;
}

export function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || ''));
}

/*
 * fillHeight presets fit the width and grow the artboard height so the scaled
 * frame fills the window; other presets are contained within both edges.
 */
export function computeFit(params) {
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
  return { scale: scale, height: height };
}

function parseBool(value) {
  if (value === undefined) return undefined;
  if (value === '' || value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
}

/*
 * Accepts presets as JSON or a compact "Label=WxH, Label=W" list.
 */
export function parsePresetList(value) {
  if (!value) return undefined;
  var text = String(value).trim();
  if (text.charAt(0) === '[') {
    try {
      var parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (err) {
      return undefined;
    }
  }
  var list = [];
  text.split(',').forEach(function (part) {
    var item = part.trim();
    if (!item) return;
    var eq = item.lastIndexOf('=');
    var label = eq === -1 ? '' : item.slice(0, eq).trim();
    var dims = (eq === -1 ? item : item.slice(eq + 1)).trim();
    var match = dims.match(/^(\d+)(?:\s*[xX]\s*(\d+))?$/);
    if (!match) return;
    list.push({
      label: label || undefined,
      width: parseInt(match[1], 10),
      height: match[2] ? parseInt(match[2], 10) : null,
    });
  });
  return list.length ? list : undefined;
}

export function optionsFromDataset(dataset) {
  if (!dataset) return {};
  var out = {};
  if (dataset.mode === 'inline' || dataset.mode === 'iframe') out.mode = dataset.mode;
  if (dataset.storageKey) out.storageKey = dataset.storageKey;
  if (dataset.defaultPreset) out.defaultPreset = dataset.defaultPreset;
  if (dataset.nonce) out.nonce = dataset.nonce;
  if (dataset.enableOn) {
    out.enableOn = dataset.enableOn.split(',').map(function (s) {
      return s.trim();
    }).filter(Boolean);
  }
  var presets = parsePresetList(dataset.presets);
  if (presets) out.presets = presets;
  var force = parseBool(dataset.force);
  if (force !== undefined) out.force = force;
  var open = parseBool(dataset.open);
  if (open !== undefined) out.open = open;
  var responsive = parseBool(dataset.responsive);
  if (responsive !== undefined) out.responsive = responsive;
  var custom = parseBool(dataset.custom);
  if (custom !== undefined) out.custom = custom;
  return out;
}
