const path = require('node:path');
const { globSync } = require('tinyglobby');

// Next's plugin uses only globSync(pattern, { onlyDirectories: true }).
// fast-glob preserves absolute input paths; tinyglobby requires this option.
exports.globSync = (pattern, options) => globSync(pattern, {
  ...options,
  absolute: path.isAbsolute(pattern),
}).map(directory => directory === path.parse(directory).root
  ? directory
  : directory.replace(/[\\/]$/, ''));
