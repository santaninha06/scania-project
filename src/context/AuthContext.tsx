import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
interface AuthValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}
const Ctx = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) queryClient.clear();
    });
    return () => data.subscription.unsubscribe();
  }, []);
  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signUp: async (name, email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        return { needsConfirmation: data.session === null };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [session, loading],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return c;
}
