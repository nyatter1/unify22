import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvxvzcavaufaixvndhre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eHZ6Y2F2YXVmYWl4dm5kaHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTAyMjQsImV4cCI6MjA5MDk4NjIyNH0.Joo5El6B_Vxm3QzZ37V76vK-CcWMK5MQe6Wb-QC6Mvc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
