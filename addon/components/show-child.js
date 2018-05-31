import Component from '@ember/component';
import layout from '../templates/components/show-child';
import { computed } from '@ember/object';
import ChildNode from '../mixins/child-node';

export default Component.extend(ChildNode, {
  layout,
  childComponentName: computed('model.displayType', function() {
    return `input-fields/${this.get('model.displayType')}/show`;
  })
});
