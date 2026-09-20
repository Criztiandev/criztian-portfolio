const lintStagedConfig = {
  "*.{js,jsx,mjs,cjs,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,yaml,yml}": ["prettier --write"],
}

export default lintStagedConfig
