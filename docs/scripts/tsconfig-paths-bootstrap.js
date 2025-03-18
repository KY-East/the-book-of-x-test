const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('../tsconfig.json');

const baseUrl = './'; // 与 tsconfig.json 中的 baseUrl 保持一致
const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
}); 