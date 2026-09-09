import { auth } from './firebase';
import type { MobileCommand, SyncPayload } from './contracts';

export const API_URL = String(process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init.body && typeof init.body === 'string' ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.errorCode || payload?.error || `HTTP_${response.status}`);
  return payload as T;
}

export const api = {
  sync: (cursor: number) => request<SyncPayload>(`/api/mobile/v1/sync?cursor=${cursor}`),
  commands: (commands: MobileCommand[]) => request<{ results: any[] }>('/api/mobile/v1/commands:batch', { method: 'POST', body: JSON.stringify({ commands }) }),
  createInvoice: (data: any) => request<any>('/api/mobile/v1/invoices', { method: 'POST', body: JSON.stringify(data) }),
  resubmitInvoice: (id: string, data: any) => request<any>(`/api/mobile/v1/invoices/${id}/resubmit`, { method: 'POST', body: JSON.stringify(data) }),
  registerDevice: (token: string, platform: 'ios' | 'android') => request<void>('/api/mobile/v1/devices', { method: 'POST', body: JSON.stringify({ token, platform }) }),
  async upload(uri: string, purpose: string, contentType: string) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}/api/mobile/v1/uploads?purpose=${encodeURIComponent(purpose)}`, {
      method: 'POST', headers: { 'Content-Type': contentType, Authorization: `Bearer ${token}` }, body: await (await fetch(uri)).blob(),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.errorCode || `HTTP_${response.status}`);
    return payload as { id: string };
  },
};
