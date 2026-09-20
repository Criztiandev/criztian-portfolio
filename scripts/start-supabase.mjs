import { spawnSync } from "node:child_process"

const SERVICE_LABELS = [
  ["API_URL", "API"],
  ["GRAPHQL_URL", "GraphQL"],
  ["REST_URL", "REST"],
  ["STUDIO_URL", "Studio"],
  ["MAILPIT_URL", "Mailpit"],
  ["DB_URL", "Postgres"],
]

function runSupabase(command) {
  return spawnSync(`supabase ${command}`, {
    encoding: "utf8",
    shell: true,
  })
}

function findLongestLabel() {
  let longest = 0

  for (const [, label] of SERVICE_LABELS) {
    if (label.length > longest) {
      longest = label.length
    }
  }

  return longest
}

function readStatus() {
  const result = runSupabase("status -o json")

  if (typeof result.stdout !== "string") {
    return null
  }

  const start = result.stdout.indexOf("{")
  const end = result.stdout.lastIndexOf("}")

  if (start === -1 || end === -1) {
    return null
  }

  try {
    return JSON.parse(result.stdout.slice(start, end + 1))
  } catch {
    return null
  }
}

function printUrls(status) {
  const width = findLongestLabel()

  console.log("")
  console.log("  Supabase is running:")
  console.log("")

  for (const [key, label] of SERVICE_LABELS) {
    const value = status[key]

    if (typeof value !== "string" || value.length === 0) {
      continue
    }

    console.log(`    ${label.padEnd(width)}  ${value}`)
  }

  console.log("")
  console.log(
    `    ${"App".padEnd(width)}  http://localhost:3000  (run \`pnpm dev\`)`
  )
  console.log("")
}

function main() {
  const started = runSupabase("start")
  const status = readStatus()

  if (status === null || typeof status.API_URL !== "string") {
    console.error(
      "Could not start Supabase or read its status. Is Docker running?"
    )

    if (typeof started.stderr === "string" && started.stderr.length > 0) {
      console.error(started.stderr.trim())
    }

    process.exitCode = 1
    return
  }

  printUrls(status)
}

main()
