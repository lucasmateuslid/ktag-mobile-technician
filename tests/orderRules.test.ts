import assert from 'node:assert/strict';
import test from 'node:test';
import type { ChecklistItem } from '../src/contracts';
import { isChecklistIncomplete, scheduleTransitions } from '../src/orderRules';

const item = (patch: Partial<ChecklistItem> = {}): ChecklistItem => ({
  name: 'Partida elétrica', before: 'OK', after: 'OK', ...patch,
});

test('aceita checklist totalmente preenchido', () => {
  assert.equal(isChecklistIncomplete([item(), item({ before: 'N/A', after: 'N/A' })]), false);
});

test('rejeita item sem avaliação de entrada ou saída', () => {
  assert.equal(isChecklistIncomplete([item({ before: '' })]), true);
  assert.equal(isChecklistIncomplete([item({ after: '' })]), true);
});

test('exige observação e ao menos uma foto para item N/OK', () => {
  assert.equal(isChecklistIncomplete([item({ before: 'N/OK' })]), true);
  assert.equal(isChecklistIncomplete([item({ before: 'N/OK', notes: 'Falha' })]), true);
  assert.equal(isChecklistIncomplete([item({ before: 'N/OK', notes: 'Falha', beforePhoto: 'foto-1' })]), false);
  assert.equal(isChecklistIncomplete([item({ after: 'N/OK', notes: 'Falha', afterPhoto: 'foto-2' })]), false);
});

test('mantém as transições permitidas da OS', () => {
  assert.deepEqual(scheduleTransitions.AGENDADA, ['EM DESLOCAMENTO', 'Frustrada']);
  assert.deepEqual(scheduleTransitions['EM DESLOCAMENTO'], ['NO LOCAL', 'Frustrada']);
  assert.deepEqual(scheduleTransitions['NO LOCAL'], ['EM EXECUÇÃO', 'Frustrada']);
  assert.equal(scheduleTransitions['EM EXECUÇÃO'], undefined);
});
