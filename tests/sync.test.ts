import assert from 'node:assert/strict';
import test from 'node:test';
import { containsPendingUpload, replaceUploads } from '../src/uploadRules';

test('substitui uploads locais aninhados sem alterar os demais valores', () => {
  const command = { photo: 'local-upload:one', checklist: [{ photo: 'local-upload:two' }], label: 'ok' };
  assert.deepEqual(replaceUploads(command, { 'local-upload:one': 'attachment-1', 'local-upload:two': 'attachment-2' }), {
    photo: 'attachment-1', checklist: [{ photo: 'attachment-2' }], label: 'ok',
  });
  assert.deepEqual(command, { photo: 'local-upload:one', checklist: [{ photo: 'local-upload:two' }], label: 'ok' });
});

test('detecta upload local ainda não resolvido em estruturas aninhadas', () => {
  assert.equal(containsPendingUpload({ checklist: [{ photo: 'local-upload:missing' }] }), true);
  assert.equal(containsPendingUpload({ checklist: [{ photo: 'attachment-1' }], count: 2 }), false);
});
