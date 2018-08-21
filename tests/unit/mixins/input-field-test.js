import EmberObject from '@ember/object';
import InputFieldMixin from '@lblod/ember-mu-dynamic-forms/mixins/input-field';
import { module, test } from 'qunit';

module('Unit | Mixin | input-field', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let InputFieldObject = EmberObject.extend(InputFieldMixin);
    let subject = InputFieldObject.create();
    assert.ok(subject);
  });
});
