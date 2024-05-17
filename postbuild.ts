import {execSync} from 'child_process';

const browsers = ['firefox', 'chrome'];

// copy css file to dist folder
const commands = [
  'ls -lah',
    ...browsers.map(browser => {
    return [
      `echo "copying css and js files to dist/${browser}"`,
      // making browser directory
      `mkdir -p dist/${browser}`,
      // copying main css and js files
      `cp src/main.css dist/${browser}`,
      `cp dist/index.js dist/${browser}`,
      // popup
      `cp -R dist/popup dist/${browser}/popup`,
      `cp -R src/popup/*.html dist/${browser}/popup/`,
      `cp -R src/popup/*.css dist/${browser}/popup/`,
      // background
      `cp -R dist/background dist/${browser}/background`,
      // manifest
      `cp src/manifest-${browser}.json dist/${browser}/manifest.json`,
      // icons
      `mkdir -p dist/${browser}/icons`,
      `cp icons/* dist/${browser}/icons`,
      // copy browser polyfill for chrome
      `cp node_modules/webextension-polyfill/dist/browser-polyfill.js dist/${browser}/browser-polyfill.js`,
      // zip
      `pushd dist/${browser}`,
      `zip -r ${browser}.zip *`,
      `popd`,
    ];
  }),
].flat();

execSync(commands.join(' && '), {
  stdio: 'inherit',
});
