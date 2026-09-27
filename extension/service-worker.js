/*
 * Auto-injects the toolbar on localhost pages (host_permissions) unless the
 * origin was switched off. Clicking the icon toggles it for the current origin;
 * on LAN IPs that works through activeTab for the current page only.
 */
var DISABLED_KEY = 'disabledOrigins';
var BUNDLE = 'layout-preview.js';

function originOf(url) {
  try {
    var parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.origin : null;
  } catch (err) {
    return null;
  }
}

async function getDisabled() {
  var data = await chrome.storage.local.get(DISABLED_KEY);
  return Array.isArray(data[DISABLED_KEY]) ? data[DISABLED_KEY] : [];
}

async function setDisabled(origin, disabled) {
  var list = (await getDisabled()).filter(function (item) {
    return item !== origin;
  });
  if (disabled) list.push(origin);
  await chrome.storage.local.set({ [DISABLED_KEY]: list });
}

function setBadge(tabId, on) {
  chrome.action.setBadgeText({ tabId: tabId, text: on ? 'ON' : '' });
  chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: '#06273a' });
}

async function isActive(tabId) {
  var results = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: function () {
      return Boolean(window.LayoutPreview && window.LayoutPreview.active);
    },
  });
  return Boolean(results && results[0] && results[0].result);
}

async function inject(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: 'MAIN',
    files: [BUNDLE],
  });
  var results = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: function () {
      if (!window.LayoutPreview) return false;
      window.LayoutPreview.init({ force: true, source: 'extension' });
      return Boolean(window.LayoutPreview.active);
    },
  });
  return Boolean(results && results[0] && results[0].result);
}

async function remove(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: function () {
      if (window.LayoutPreview && window.LayoutPreview.active) window.LayoutPreview.destroy();
    },
  });
}

chrome.tabs.onUpdated.addListener(async function (tabId, info, tab) {
  if (info.status !== 'complete' || !tab.url) return;
  var origin = originOf(tab.url);
  if (!origin) return;
  try {
    if (!(await chrome.permissions.contains({ origins: [origin + '/*'] }))) return;
    if ((await getDisabled()).indexOf(origin) !== -1) {
      setBadge(tabId, false);
      return;
    }
    var on = (await isActive(tabId)) || (await inject(tabId));
    setBadge(tabId, on);
  } catch (err) {
    /* page not scriptable (e.g. navigated away mid-injection) */
  }
});

chrome.action.onClicked.addListener(async function (tab) {
  var origin = originOf(tab.url || '');
  if (!origin || tab.id == null) return;
  try {
    if (await isActive(tab.id)) {
      await remove(tab.id);
      await setDisabled(origin, true);
      setBadge(tab.id, false);
    } else {
      await setDisabled(origin, false);
      setBadge(tab.id, await inject(tab.id));
    }
  } catch (err) {
    setBadge(tab.id, false);
  }
});
