import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://opzfdxilohqbgmjxqfes.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wemZkeGlsb2hxYmdtanhxZmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjE5ODcsImV4cCI6MjA2NzY5Nzk4N30.scuX68v1I8fEVuD_muGaG0xfgJZ-0R4D-OXBILnaYbo';

export const supabase = createClient(supabaseUrl, supabaseKey); 