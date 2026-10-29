import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/type/database.type"

export type Db = SupabaseClient<Database>
