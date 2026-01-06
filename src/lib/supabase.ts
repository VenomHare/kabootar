import { createClient } from "@supabase/supabase-js";

export const getServiceSupabase = () => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
        throw new Error("Missing required Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY)");
    }

    return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY;
if (!SUPABASE_URL || !SUPABASE_PUB_KEY) {
    throw new Error("Missing required Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUB_KEY)");
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUB_KEY);
