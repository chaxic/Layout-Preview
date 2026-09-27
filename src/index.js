import { CHANGE_EVENT, VERSION, destroy, getActive, init } from './core.js';
import { DEFAULT_PRESETS, isLocalDevHost, optionsFromDataset } from './utils.js';

function activeValue(key, fallback) {
  var active = getActive();
  return active ? active[key] : fallback;
}

/*
 * Another bundle copy (e.g. the browser extension's) may already own the page.
 * A project's own config replaces an extension instance; otherwise first wins.
 */
function publicInit(options) {
  var opts = options || {};
  if (typeof window !== 'undefined') {
    var foreign = window.LayoutPreview;
    if (foreign && foreign !== LayoutPreview && foreign.active) {
      if (foreign.source === 'extension' && opts.source !== 'extension') {
        foreign.destroy();
      } else {
        return foreign;
      }
    }
  }
  var controller = init(opts);
  if (controller.active && typeof window !== 'undefined') {
    window.LayoutPreview = LayoutPreview;
  }
  return controller;
}

/*
 * Stable global contract. Site code should read LayoutPreview.width (number or
 * null) or listen for the layoutpreview:change event. window.__devLayoutWidth
 * is still set in inline mode as a deprecated alias.
 */
export var LayoutPreview = {
  version: VERSION,
  CHANGE_EVENT: CHANGE_EVENT,
  DEFAULT_PRESETS: DEFAULT_PRESETS,
  init: publicInit,
  destroy: destroy,
  isLocalDevHost: isLocalDevHost,
  get active() {
    return Boolean(getActive());
  },
  get source() {
    return activeValue('source', null);
  },
  get width() {
    return activeValue('width', null);
  },
  get height() {
    return activeValue('height', null);
  },
  get mode() {
    return activeValue('mode', null);
  },
  get preset() {
    return activeValue('preset', null);
  },
  get scale() {
    return activeValue('scale', 1);
  },
  setPreset: function (id) {
    var active = getActive();
    if (active) active.setPreset(id);
  },
  setMode: function (mode) {
    var active = getActive();
    if (active) active.setMode(mode);
  },
  open: function () {
    var active = getActive();
    if (active) active.open();
  },
  close: function () {
    var active = getActive();
    if (active) active.close();
  },
  toggle: function () {
    var active = getActive();
    if (active) active.toggle();
  },
};

export function installGlobal() {
  if (typeof window === 'undefined') return LayoutPreview;
  var existing = window.LayoutPreview;
  if (existing && existing !== LayoutPreview && existing.active) {
    return existing;
  }
  window.LayoutPreview = LayoutPreview;
  return LayoutPreview;
}

installGlobal();

export { CHANGE_EVENT, VERSION, destroy, publicInit as init, isLocalDevHost, optionsFromDataset, DEFAULT_PRESETS };
export default LayoutPreview;
