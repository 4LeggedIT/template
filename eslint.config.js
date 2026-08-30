import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".claude/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // Pin the root explicitly. typescript-eslint infers this automatically,
        // but the inference hard-fails when a nested checkout (e.g. a leftover
        // git worktree under .claude/worktrees/) supplies a second candidate
        // tsconfig root. Pinning it keeps lint working regardless.
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "badgeVariants",
            "buttonVariants",
            "navigationMenuTriggerStyle",
            "toggleVariants",
            "useFormField",
            "useSidebar",
            "toast",
            "JotFormModal",
            "JOTFORM_URLS",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["src/components/JotFormModal.tsx", "src/components/patterns/JotFormModal.tsx", "src/components/shared/FormEmbedModal.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
