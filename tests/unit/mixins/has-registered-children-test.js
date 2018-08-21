import EmberObject from '@ember/object';
import HasRegisteredChildrenMixin from '@lblod/ember-mu-dynamic-forms/mixins/has-registered-children';
import { module, test } from 'qunit';

module('Unit | Mixin | has-registered-children', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let HasRegisteredChildrenObject = EmberObject.extend(HasRegisteredChildrenMixin);
    let subject = HasRegisteredChildrenObject.create();
    assert.ok(subject);
  });
});
