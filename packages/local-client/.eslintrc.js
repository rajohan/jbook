module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "simple-import-sort", "import" /*"jsx-a11y"*/],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        //"plugin:jsx-a11y/recommended",
        "prettier",
        "prettier/@typescript-eslint",
        "prettier/react",
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        node: true,
        browser: true,
        commonjs: true,
        amd: true,
    },
    rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "sort-imports": "off",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-empty-function": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
