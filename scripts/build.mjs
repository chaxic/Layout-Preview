import { build } from 'esbuild';
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

var root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
var pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
var banner = '/*! layout-preview v' + pkg.version + ' | MIT | https://github.com/chaxic/layout-preview */';

var shared = {
  bundle: true,
  target: ['es2019'],
  loader: { '.css': 'text' },
  define: { __LAYOUT_PREVIEW_VERSION__: JSON.stringify(pkg.version) },
  banner: { js: banner },
  legalComments: 'none',
  logLevel: 'info',
};

await rm(resolve(root, 'dist'), { recursive: true, force: true });
await mkdir(resolve(root, 'dist'), { recursive: true });

await Promise.all([
  build({
    ...shared,
    entryPoints: [resolve(root, 'src/iife.js')],
    outfile: resolve(root, 'dist/layout-preview.js'),
    format: 'iife',
  }),
  build({
    ...shared,
    entryPoints: [resolve(root, 'src/iife.js')],
    outfile: resolve(root, 'dist/layout-preview.min.js'),
    format: 'iife',
    minify: true,
  }),
  build({
    ...shared,
    entryPoints: [resolve(root, 'src/index.js')],
    outfile: resolve(root, 'dist/layout-preview.mjs'),
    format: 'esm',
  }),
  build({
    ...shared,
    entryPoints: [resolve(root, 'src/auto.js')],
    outfile: resolve(root, 'dist/auto.mjs'),
    format: 'esm',
  }),
]);

await copyFile(resolve(root, 'dist/layout-preview.js'), resolve(root, 'extension/layout-preview.js'));
