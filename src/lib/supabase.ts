import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cetiqoguylvcilbdsxiv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldGlxb2d1eWx2Y2lsYmRzeGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNTI1NDEsImV4cCI6MjA4NzYyODU0MX0.BU20HCw9bwhJmuFqiaq7aVx1RX6XGnivAt8s1JmNQYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
