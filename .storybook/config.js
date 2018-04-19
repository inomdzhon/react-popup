import { configure, setAddon } from '@storybook/react';
import { setConsoleOptions } from '@storybook/addon-console';

const path = require('path');

setConsoleOptions({
  panelExclude: [],
});
// automatically import all files ending in *.stories.js
const req = require.context('../Popup', true, /.stories.jsx?$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
