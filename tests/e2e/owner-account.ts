import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database.type"

export const TEST_OWNER_EMAIL = "editor-e2e@example.test"

export const TEST_OWNER_PASSWORD = "editor-e2e-password-1234"

function readSupabaseEnvironment() {
  if (process.env.SUPABASE_SECRET_KEY === undefined) {
    process.loadEnvFile(".env.local")
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (
    url === undefined ||
    secretKey === undefined ||
    publishableKey === undefined
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set to run the logged-in specs"
    )
  }

  return { url, secretKey, publishableKey }
}

export function createAdminClient() {
  const environment = readSupabaseEnvironment()

  return createClient<Database>(environment.url, environment.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function createPublishableClient() {
  const environment = readSupabaseEnvironment()

  return createClient<Database>(environment.url, environment.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function findTestOwnerId(
  admin: ReturnType<typeof createAdminClient>
): Promise<string | null> {
  const { data } = await admin.auth.admin.listUsers()

  for (const user of data.users) {
    if (user.email === TEST_OWNER_EMAIL) {
      return user.id
    }
  }

  return null
}

export async function createTestOwner(): Promise<void> {
  const admin = createAdminClient()

  await deleteTestOwner()

  const { error } = await admin.auth.admin.createUser({
    email: TEST_OWNER_EMAIL,
    password: TEST_OWNER_PASSWORD,
    email_confirm: true,
  })

  if (error !== null) {
    throw new Error(`Could not create the test owner: ${error.message}`)
  }
}

export async function deleteTestOwner(): Promise<void> {
  const admin = createAdminClient()
  const existingId = await findTestOwnerId(admin)

  if (existingId === null) {
    return
  }

  await admin.auth.admin.deleteUser(existingId)
}
