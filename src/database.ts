import * as SQLite from 'expo-sqlite';
import type { MobileCommand, SyncPayload } from './contracts';

const db = SQLite.openDatabaseSync('ktag-technician.db');

export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS entities (kind TEXT NOT NULL, id TEXT NOT NULL, json TEXT NOT NULL, updated_at INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(kind,id));
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS commands (id TEXT PRIMARY KEY NOT NULL, json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', error TEXT, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS uploads (id TEXT PRIMARY KEY NOT NULL, uri TEXT NOT NULL, purpose TEXT NOT NULL, content_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attachment_id TEXT, error TEXT, created_at INTEGER NOT NULL);
  `);
}

export function saveSync(payload: SyncPayload) {
  db.withTransactionSync(() => {
    const groups: Array<[string, any[]]> = [['schedule', payload.schedules], ['inventory', payload.inventory], ['payment', payload.payments], ['invoice', payload.invoices], ['notification', payload.notifications]];
    for (const [kind, values] of groups) for (const value of values) db.runSync('INSERT OR REPLACE INTO entities(kind,id,json,updated_at) VALUES(?,?,?,?)', kind, String(value.id), JSON.stringify(value), Number(value.updatedAt || value.date || Date.now()));
    if (payload.profile) db.runSync('INSERT OR REPLACE INTO entities(kind,id,json,updated_at) VALUES(?,?,?,?)', 'profile', 'current', JSON.stringify(payload.profile), Date.now());
    db.runSync('INSERT OR REPLACE INTO meta(key,value) VALUES(?,?)', 'cursor', String(payload.cursor));
  });
}

export const getCursor = () => Number(db.getFirstSync<{ value: string }>('SELECT value FROM meta WHERE key=?', 'cursor')?.value || 0);
export const listEntities = <T>(kind: string): T[] => db.getAllSync<{ json: string }>('SELECT json FROM entities WHERE kind=? ORDER BY updated_at DESC', kind).map(row => JSON.parse(row.json));
export const getEntity = <T>(kind: string, id: string): T | null => { const row = db.getFirstSync<{ json: string }>('SELECT json FROM entities WHERE kind=? AND id=?', kind, id); return row ? JSON.parse(row.json) : null; };
export const upsertEntity = (kind: string, value: { id: string; updatedAt?: number }) => db.runSync('INSERT OR REPLACE INTO entities(kind,id,json,updated_at) VALUES(?,?,?,?)', kind, value.id, JSON.stringify(value), Number(value.updatedAt || Date.now()));

export function enqueueCommand(command: MobileCommand) {
  db.runSync('INSERT OR REPLACE INTO commands(id,json,status,created_at) VALUES(?,?,?,?)', command.commandId, JSON.stringify(command), 'pending', command.createdAt);
}
export const pendingCommands = () => db.getAllSync<{ id: string; json: string }>("SELECT id,json FROM commands WHERE status='pending' ORDER BY created_at ASC").map(row => ({ id: row.id, command: JSON.parse(row.json) as MobileCommand }));
export const applyCommandResult = (id: string, result: any) => result.status === 'applied' ? db.runSync('DELETE FROM commands WHERE id=?', id) : db.runSync('UPDATE commands SET status=?,error=? WHERE id=?', result.status, result.errorCode || null, id);

export function enqueueUpload(uri: string, purpose: string, contentType: string) {
  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  db.runSync('INSERT INTO uploads(id,uri,purpose,content_type,status,created_at) VALUES(?,?,?,?,?,?)', id, uri, purpose, contentType, 'pending', Date.now());
  return `local-upload:${id}`;
}
export const pendingUploads = () => db.getAllSync<any>("SELECT * FROM uploads WHERE status='pending' ORDER BY created_at ASC");
export const completeUpload = (id: string, attachmentId: string) => db.runSync("UPDATE uploads SET status='uploaded',attachment_id=?,error=NULL WHERE id=?", attachmentId, id);
export const failUpload = (id: string, error: string) => db.runSync("UPDATE uploads SET error=? WHERE id=?", error, id);
export const uploadMappings = () => Object.fromEntries(db.getAllSync<{ id: string; attachment_id: string }>("SELECT id,attachment_id FROM uploads WHERE status='uploaded'").map(row => [`local-upload:${row.id}`, row.attachment_id]));
