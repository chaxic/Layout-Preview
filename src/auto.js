import LayoutPreview from './index.js';

var config = typeof window !== 'undefined' && window.LayoutPreviewConfig ? window.LayoutPreviewConfig : {};
LayoutPreview.init(config);

export default LayoutPreview;
