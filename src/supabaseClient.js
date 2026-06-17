import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfcehyxcexskzajlbaqs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmY2VoeXhjZXhza3phamxiYXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQ1MzgsImV4cCI6MjA4NTYyMDUzOH0.HY9sY2IdPMWaM5wCr1LqTQPlYp6OC5lT1jJK4_fka2g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
