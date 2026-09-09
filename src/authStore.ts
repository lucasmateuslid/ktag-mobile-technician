import { create } from 'zustand';
import { onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import { API_URL } from './api';

type AuthState = { user: User | null; ready: boolean; error?: string; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void> };
export const useAuthStore = create<AuthState>(set => ({
  user: null, ready: false,
  login: async (email, password) => {
    set({ error: undefined });
    try { await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password); }
    catch {
      const response = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.customToken) throw new Error('E-mail ou senha inválidos.');
      await signInWithCustomToken(auth, payload.customToken);
    }
  },
  logout: async () => { await signOut(auth); },
}));
onAuthStateChanged(auth, user => useAuthStore.setState({ user, ready: true }));
