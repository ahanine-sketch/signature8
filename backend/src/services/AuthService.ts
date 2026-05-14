import { createAuthClient } from '../config/supabase';

export class AuthService {
  static async login(email: string, pass: string) {
    // CRITICAL: use a fresh, isolated client per login call.
    // Never use the shared `supabase` singleton for auth.signIn —
    // it would persist the user JWT in memory and corrupt all subsequent
    // service-role data queries with that user's RLS context.
    const authClient = createAuthClient();

    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    return data;
  }

  static async logout() {
    // logout is stateless from the server's perspective — the client
    // simply discards its JWT token. Nothing to do server-side.
    return true;
  }
}
