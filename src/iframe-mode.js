export var FRAME_NAME = 'layout-preview-frame';

export function isPreviewFrame() {
  try {
    return window.name === FRAME_NAME && window.parent !== window;
  } catch (err) {
    return false;
  }
}

/*
 * Renders the current page inside a same-origin iframe sized to the preset so
 * the iframe's viewport (and therefore @media queries) matches the device.
 */
export function createStage(hooks) {
  var root = document.documentElement;
  var stage = document.createElement('layout-preview-stage');
  var device = document.createElement('layout-preview-device');
  var frame = document.createElement('iframe');
  var hideScrollbar = false;
  var blocked = false;

  frame.name = FRAME_NAME;
  frame.title = 'Layout preview frame';
  frame.setAttribute('loading', 'eager');
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
      html.style.setProperty('scrollbar-width', 'none');
    } else {
      html.style.removeProperty('scrollbar-width');
    }
  }

  function onLoad() {
    var win = frameWindow();
    blocked = !win || /^(about:blank|chrome-error:)/.test(String(win.location.href));
    if (!blocked) {
      applyScrollbar();
      try {
        if (win.location.href !== window.location.href) {
          window.history.replaceState(window.history.state, '', win.location.href);
        }
        if (win.document.title) document.title = win.document.title;
      } catch (err) {
        /* cross-origin navigation inside the frame */
      }
    }
    if (hooks && hooks.onLoad) hooks.onLoad({ blocked: blocked });
  }

  frame.addEventListener('load', onLoad);
  device.appendChild(frame);
  stage.appendChild(device);
  root.appendChild(stage);
  root.setAttribute('data-layout-preview-stage', 'true');

  return {
    update: function (params) {
      stage.style.setProperty('--layout-preview-w', params.width + 'px');
      stage.style.setProperty('--layout-preview-h', params.height + 'px');
      stage.style.setProperty('--layout-preview-scale', String(params.scale || 1));
      if (params.fit) stage.setAttribute('data-fit', 'true');
      else stage.removeAttribute('data-fit');
      if (params.frame) stage.setAttribute('data-frame', 'true');
      else stage.removeAttribute('data-frame');
      if (params.hideScrollbar !== hideScrollbar) {
        hideScrollbar = Boolean(params.hideScrollbar);
        applyScrollbar();
      }
    },
    isBlocked: function () {
      return blocked;
    },
    destroy: function () {
      frame.removeEventListener('load', onLoad);
      if (stage.parentNode) stage.parentNode.removeChild(stage);
      root.removeAttribute('data-layout-preview-stage');
    },
  };
}
