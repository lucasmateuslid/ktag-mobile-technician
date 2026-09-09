import type { ChecklistItem, ScheduleStatus } from './contracts';

export const scheduleTransitions: Partial<Record<ScheduleStatus, ScheduleStatus[]>> = {
  AGENDADA: ['EM DESLOCAMENTO', 'Frustrada'],
  Reagendada: ['EM DESLOCAMENTO', 'Frustrada'],
  'EM DESLOCAMENTO': ['NO LOCAL', 'Frustrada'],
  'NO LOCAL': ['EM EXECUÇÃO', 'Frustrada'],
};

export function isChecklistIncomplete(checklist: ChecklistItem[]) {
  return checklist.some(item => {
    if (!item.before || !item.after) return true;
    const hasProblem = item.before === 'N/OK' || item.after === 'N/OK';
    return hasProblem && (!item.notes?.trim() || (!item.beforePhoto && !item.afterPhoto));
  });
}
