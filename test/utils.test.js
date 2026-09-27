import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUSTOM_ID,
  RESPONSIVE_ID,
  clampSize,
  computeFit,
  hostAllowed,
  isLocalDevHost,
  normalizePresets,
  optionsFromDataset,
  parsePresetList,
} from '../src/utils.js';

test('isLocalDevHost accepts loopback and private ranges', function () {
  ['localhost', '127.0.0.1', '127.1.2.3', '[::1]', 'app.localhost', '192.168.1.20', '10.0.0.5', '172.16.0.1', '172.31.255.255']
    .forEach(function (host) {
      assert.equal(isLocalDevHost(host), true, host);
    });
});

test('isLocalDevHost rejects public hosts and non-private 172 ranges', function () {
  ['example.com', 'localhost.example.com', '172.15.0.1', '172.32.0.1', '172.1.2.3', '8.8.8.8', '', null]
    .forEach(function (host) {
      assert.equal(isLocalDevHost(host), false, String(host));
    });
});

test('hostAllowed supports lists, wildcards, regexes and functions', function () {
  assert.equal(hostAllowed('preview.pages.dev', ['*.pages.dev']), true);
  assert.equal(hostAllowed('pages.dev', ['*.pages.dev']), false);
  assert.equal(hostAllowed('staging.example.com', [/^staging\./]), true);
  assert.equal(hostAllowed('example.com', ['example.com']), true);
  assert.equal(hostAllowed('example.com', function () { return true; }), true);
  assert.equal(hostAllowed('example.com'), false);
  assert.equal(hostAllowed('localhost'), true);
});

test('clampSize enforces bounds', function () {
  assert.equal(clampSize('100', 1024), 1024);
  assert.equal(clampSize('abc', 768), 768);
  assert.equal(clampSize('9000', 1), 4000);
  assert.equal(clampSize(390, 1), 390);
});

test('normalizePresets adds responsive and custom around sized presets', function () {
  var list = normalizePresets([{ label: 'Phone', width: 360, height: 780 }, { id: 'bad', width: 10 }]);
  assert.deepEqual(list.map(function (p) { return p.id; }), [RESPONSIVE_ID, 'phone', CUSTOM_ID]);
  assert.equal(list[1].height, 780);
});

test('normalizePresets respects responsive/custom opt-outs and defaults', function () {
  var list = normalizePresets(null, { responsive: false, custom: false });
  assert.ok(list.length >= 3);
  assert.ok(list.every(function (p) { return p.width; }));
});

test('normalizePresets de-duplicates ids', function () {
  var list = normalizePresets([{ id: 'a', width: 400 }, { id: 'a', width: 500 }], { responsive: false, custom: false });
  assert.notEqual(list[0].id, list[1].id);
});

test('computeFit contains device presets and fills height for desktop', function () {
  var device = computeFit({ width: 768, height: 1024, viewportWidth: 1000, viewportHeight: 600 });
  assert.ok(device.scale < 1);
  assert.equal(device.height, 1024);

  var desktop = computeFit({ width: 1920, height: 1080, fillHeight: true, viewportWidth: 1000, viewportHeight: 900 });
  assert.ok(desktop.scale < 1);
  assert.ok(desktop.height >= 1080);

  var fits = computeFit({ width: 360, height: 780, viewportWidth: 1920, viewportHeight: 1080 });
  assert.equal(fits.scale, 1);
});

test('parsePresetList parses compact and JSON forms', function () {
  assert.deepEqual(parsePresetList('Phone=390x844, Wide=1600'), [
    { label: 'Phone', width: 390, height: 844 },
    { label: 'Wide', width: 1600, height: null },
  ]);
  assert.deepEqual(parsePresetList('[{"width":500}]'), [{ width: 500 }]);
  assert.equal(parsePresetList('[oops'), undefined);
  assert.equal(parsePresetList(''), undefined);
});

test('optionsFromDataset maps data attributes', function () {
  var opts = optionsFromDataset({
    mode: 'iframe',
    storageKey: 'proj',
    presets: 'A=400x800',
    force: '',
    enableOn: '*.pages.dev, staging.example.com',
    custom: 'false',
  });
  assert.equal(opts.mode, 'iframe');
  assert.equal(opts.storageKey, 'proj');
  assert.equal(opts.force, true);
  assert.equal(opts.custom, false);
  assert.deepEqual(opts.enableOn, ['*.pages.dev', 'staging.example.com']);
  assert.equal(opts.presets[0].width, 400);
  assert.equal(optionsFromDataset({ mode: 'bogus' }).mode, undefined);
});
