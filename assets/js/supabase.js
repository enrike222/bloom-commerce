import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL = "https://kytrjndwcphokqnoaxws.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHJqbmR3Y3Bob2txbm9heHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1OTg1MDgsImV4cCI6MjEwMTE3NDUwOH0.67Q4WhaYXRsQLuj1jXrfy0NDLzdh9ytLzJNN6JZ--TU";


export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


console.log(
    "Bloom conectado a Supabase:",
    SUPABASE_URL
);