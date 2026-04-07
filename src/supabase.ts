import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klwbukuercqidlhzefot.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2J1a3VlcmNxaWRsaHplZm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzI2MTUsImV4cCI6MjA5MTE0ODYxNX0.Ky_xD1RHiegFoMdSjVFmzHDpnPheUdvFafICjS4x2lU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'chat-app-auth'
  }
});
