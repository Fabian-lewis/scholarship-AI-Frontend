// Handles signup, login and logout

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ------ Auth Functions ------
export async function signUp(email: string, password: string, firstName: string, lastName: string){
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Store first_name, last_name, and an onboarded: false flag in Supabase’s user_metadata.
    options: {
      data: { first_name: firstName, last_name: lastName, onboarded: false },
      //emailRedirectTo: `${window.location.origin}/onboarding`, // Redirect to onboarding page after signup
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({email, password});
    if (error) throw error;
    return data;
    
}

export async function signOut(){
    await supabase.auth.signOut();
}