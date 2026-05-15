import { createClient } from '@supabase/supabase-js'

// ใช้ Supabase เดียวกับโปรเจคผลิต
const SUPABASE_URL = 'https://belwjdajuaxbhaqtlhrj.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbHdqZGFqdWF4YmhhcXRsaHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzgzNzYsImV4cCI6MjA5NDM1NDM3Nn0.aM-DKa8v0OlQQW6MsDzmCrEFY0d8rEVgzuemZ8UKZJA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
