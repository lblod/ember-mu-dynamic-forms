import { computed } from '@ember/object';
import Component from '@ember/component';
import ChildNode from '../mixins/child-node';
import layout from '../templates/components/edit-child';

export default Component.extend(ChildNode, {
  layout,
  childComponentName: computed('model.displayType', function() {
    return `input-fields/${this.get('model.displayType')}/edit`;
  })
});
