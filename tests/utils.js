const test = require('tape');
const Utils = require('../common/utils');

test('Tape setup', (assert) => {
  assert.pass('should setup tape');
  assert.end();
});

test('Utils import', (assert) => {
  assert.equal(typeof Utils === 'object', true, 'should import utils');
  assert.equal(typeof Utils.isEmpty === 'function', true, 'should import Utils.isEmpty');
  assert.end();
});
