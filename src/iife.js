import LayoutPreview, { installGlobal, optionsFromDataset } from './index.js';

/*
 * Script-tag build. Auto-initialises from window.LayoutPreviewConfig merged
 * with data-* attributes, unless data-auto="false". Injected copies (browser
 * extension) have no currentScript and never auto-initialise.
 */
installGlobal();
var script = typeof document !== 'undefined' ? document.currentScript : null;

if (script && script.dataset.auto !== 'false') {
  var base = window.LayoutPreviewConfig || {};
  var fromData = optionsFromDataset(script.dataset);
  var merged = {};
  Object.keys(base).forEach(function (key) {
    merged[key] = base[key];
  });
  Object.keys(fromData).forEach(function (key) {
    merged[key] = fromData[key];
  });
  if (!merged.nonce && script.nonce) merged.nonce = script.nonce;
  LayoutPreview.init(merged);
}
