import { create } from 'zustand';
import type { InventoryItem, Schedule, TechnicianInvoice, TechnicianPayment } from './contracts';
import { listEntities } from './database';
import { synchronize } from './sync';

type State = { schedules: Schedule[]; inventory: InventoryItem[]; payments: TechnicianPayment[]; invoices: TechnicianInvoice[]; syncing: boolean; error?: string; refreshLocal: () => void; sync: () => Promise<void> };
export const useAppStore = create<State>((set, get) => ({
  schedules: [], inventory: [], payments: [], invoices: [], syncing: false,
  refreshLocal: () => set({ schedules: listEntities('schedule'), inventory: listEntities('inventory'), payments: listEntities('payment'), invoices: listEntities('invoice') }),
  sync: async () => {
    if (get().syncing) return;
    set({ syncing: true, error: undefined });
    try { await synchronize(); get().refreshLocal(); }
    catch (error: any) { set({ error: error?.message || 'SYNC_FAILED' }); }
    finally { set({ syncing: false }); }
  },
}));
