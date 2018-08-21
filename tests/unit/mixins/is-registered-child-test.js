import EmberObject from '@ember/object';
import IsRegisteredChildMixin from '@lblod/ember-mu-dynamic-forms/mixins/is-registered-child';
import { module, test } from 'qunit';

module('Unit | Mixin | is-registered-child', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let IsRegisteredChildObject = EmberObject.extend(IsRegisteredChildMixin);
    let subject = IsRegisteredChildObject.create();
    assert.ok(subject);
  });
});
