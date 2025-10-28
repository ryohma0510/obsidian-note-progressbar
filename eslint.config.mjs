import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const typescriptAdjustments =
	tsPlugin.configs["eslint-recommended"]?.overrides?.[0]?.rules ?? {};

export default [
	{
		ignores: [
			"node_modules/",
			"dist/",
			"build/",
			"coverage/",
			"*.min.js",
			"main.js",
		],
	},
	{
		...js.configs.recommended,
		languageOptions: {
			...(js.configs.recommended.languageOptions ?? {}),
			sourceType: "module",
			ecmaVersion: "latest",
		},
	},
	{
		files: ["**/*.cjs", "**/*.mjs"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				process: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				module: "readonly",
				require: "readonly",
			},
		},
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			...typescriptAdjustments,
			...tsPlugin.configs.recommended.rules,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
			"@typescript-eslint/ban-ts-comment": "off",
			"no-prototype-builtins": "off",
			"@typescript-eslint/no-empty-function": "off",
		},
	},
];
