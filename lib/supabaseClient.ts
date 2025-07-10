import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zcsvohdgsdpkolnndjwe.supabase.co'
// A SUPABASE_KEY deve ser a anon key pública.
// A service_role key que você forneceu anteriormente NÃO DEVE ser exposta no lado do cliente.
// Usando a anon key correta fornecida pelo usuário.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjc3ZvaGRnc2Rwa29sbm5kandlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTgyMjMsImV4cCI6MjA2NjQ3NDIyM30.FCAQdG9JBYKRDLWeqpZ0Rycw5eEfnX3hh8LGHyb80sc';

if (!supabaseUrl) {
  console.warn("Supabase URL is not defined. Please check your environment variables.");
}
if (!supabaseAnonKey) {
  console.warn("Supabase Anon Key is not defined. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
