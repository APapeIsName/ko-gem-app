import { supabase } from './client';

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        }
    },
  })
  return data;
}