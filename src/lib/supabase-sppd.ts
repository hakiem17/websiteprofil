import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SPPD_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SPPD_SUPABASE_ANON_KEY!;

// Client for SPPDPro Database (External)
export const supabaseSppd = createClient(supabaseUrl, supabaseKey);
