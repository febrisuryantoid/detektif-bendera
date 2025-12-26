
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yzpezhqxhmkgyskvklge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h5aYtHt-cUt9Gp9FDfWqhg_Go2nSYgL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
