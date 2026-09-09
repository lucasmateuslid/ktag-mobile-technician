import NetInfo from '@react-native-community/netinfo';
import { api } from './api';
import { applyCommandResult, completeUpload, failUpload, getCursor, pendingCommands, pendingUploads, saveSync, uploadMappings } from './database';
import { containsPendingUpload, replaceUploads } from './uploadRules';

let running: Promise<void> | null = null;

export function synchronize() {
  if (running) return running;
  running = (async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;
    for (const upload of pendingUploads()) {
      try { const result = await api.upload(upload.uri, upload.purpose, upload.content_type); completeUpload(upload.id, result.id); }
      catch (error: any) { failUpload(upload.id, error?.message || 'UPLOAD_FAILED'); }
    }
    const map = uploadMappings();
    const queued = pendingCommands();
    const ready = queued.map(item => ({ ...item, command: replaceUploads(item.command, map) })).filter(item => !containsPendingUpload(item.command));
    if (ready.length) {
      const response = await api.commands(ready.map(item => item.command));
      response.results.forEach(result => applyCommandResult(result.commandId, result));
    }
    saveSync(await api.sync(getCursor()));
  })().finally(() => { running = null; });
  return running;
}

export const subscribeConnectivitySync = () => NetInfo.addEventListener(state => { if (state.isConnected) void synchronize(); });
