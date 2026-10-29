import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const higherOrderFunctions = {
  selector:
    "CallExpression[callee.property.name=/^(reduce|reduceRight|some|every|find|findIndex|findLast|findLastIndex|flatMap)$/]",
  message: "Use for...of, forEach, map or filter",
}

const typeDeclarations = [
  { selector: "TSInterfaceDeclaration", message: "Declare types in src/type" },
  { selector: "TSTypeAliasDeclaration", message: "Declare types in src/type" },
  { selector: "TSEnumDeclaration", message: "Declare types in src/type" },
]

const supabasePackages = [
  {
    name: "@supabase/ssr",
    allowTypeImports: true,
    message: "Build Supabase clients only in src/lib/supabase",
  },
  {
    name: "@supabase/supabase-js",
    allowTypeImports: true,
    message: "Build Supabase clients only in src/lib/supabase",
  },
]

function layer(files, deny, message) {
  return {
    files,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: supabasePackages,
          patterns: [{ group: deny, allowTypeImports: true, message }],
        },
      ],
    },
  }
}

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}", "test/**/*.ts"],
    ignores: ["src/components/ui/**", "src/type/**", "**/*.d.ts"],
    rules: {
      curly: ["error", "all"],
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-throw-literal": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-restricted-syntax": ["error", higherOrderFunctions, ...typeDeclarations],
    },
  },
  {
    files: ["src/type/**/*.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "no-restricted-syntax": ["error", higherOrderFunctions],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/supabase/**"],
    rules: { "no-restricted-imports": ["error", { paths: supabasePackages }] },
  },
  layer(
    ["src/type/**", "src/model/**", "src/data/**", "src/util/**"],
    ["@/service/*", "@/repository/*", "@/lib/*"],
    "model, type, data and util stay independent of the app layers"
  ),
  layer(
    ["src/repository/**"],
    ["@/service/*", "@/router/*", "@/app/*", "@/components/*", "@/hooks/*", "@/lib/*"],
    "Repositories depend only on type, error and the injected client"
  ),
  layer(
    ["src/service/**"],
    ["@/router/*", "@/app/*", "@/components/*", "@/hooks/*", "@/lib/supabase/*", "@/lib/trpc/*"],
    "Services get the client injected and never touch the transport"
  ),
  layer(
    ["src/router/**"],
    ["@/app/*", "@/components/*", "@/hooks/*", "@/lib/supabase/*", "@/lib/resend"],
    "Routers stay thin: schema in, service or repository call"
  ),
  layer(
    ["src/components/**", "src/hooks/**"],
    [
      "@/router/*",
      "@/service/*",
      "@/repository/*",
      "@/lib/trpc/init",
      "@/lib/supabase/server",
      "@/lib/supabase/proxy",
      "@/lib/supabase/public",
      "@/lib/resend",
    ],
    "UI reaches data through tRPC"
  ),
  layer(
    ["src/app/(marketing)/**"],
    [
      "@tiptap/*",
      "@/lib/tiptap",
      "@/components/markdown-editor",
      "@/components/ui/toast",
      "@/lib/supabase/server",
    ],
    "Public pages stay static and editor-free"
  ),
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/type/database.type.ts",
  ]),
])
