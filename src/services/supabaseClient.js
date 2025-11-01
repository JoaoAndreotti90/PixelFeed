import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aouxjcncxgosbyqtsiug.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdXhqY25jeGdvc2J5cXRzaXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODk5ODMsImV4cCI6MjA3NzI2NTk4M30.O9QpOBJaKHCU4qjGbI4tZN4OGhblCk1WVeftYvH8XLM";

export const supabase = createClient(supabaseUrl, supabaseKey);