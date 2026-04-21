import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://vntsvaodzbaxjaoslzdi.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudHN2YW9kemJheGphb3NsemRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzU4NzUsImV4cCI6MjA5MjI1MTg3NX0.XCobNbtjfj7Ot-jX7hYjjEMyUbyvZ_riJprEUoSbUGc"
);