import antfu from "@antfu/eslint-config"

export default antfu({
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  ignores: [
    "dist",
  ],
  rules: {
    "no-console": "off",
  },
})
