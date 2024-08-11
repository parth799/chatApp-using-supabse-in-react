import { createClient } from "@supabase/supabase-js";

//? This is the client initialisation. This will be used by all services that interact with supabase
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const client = createClient("https://stqwwfsarvlavwltwxai.supabase.co", anonKey);

export default client;
