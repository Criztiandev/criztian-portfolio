// Groups must not overlap: two tasks editing the same file concurrently
// can corrupt lint-staged's stash/restore of partially staged work.
export default {
  "*.{js,jsx,mjs,cjs,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,yaml,yml}": ["prettier --write"],
}
