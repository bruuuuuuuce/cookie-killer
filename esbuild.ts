import { build } from 'esbuild';

// build content script
build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
}).catch(() => process.exit(1));

// build popup html and javascript
build({
  entryPoints: ['src/popup/index.ts'],
  bundle: true,
  outdir: 'dist/popup',
}).catch(() => process.exit(1));

// build background task
build({
  entryPoints: ['src/background/index.ts'],
  bundle: true,
  outdir: 'dist/background',
}).catch(() => process.exit(1));
