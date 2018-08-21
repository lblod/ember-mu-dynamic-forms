import Component from '@ember/component';
import layout from '../templates/components/show-child';
import { computed } from '@ember/object';
import ChildNode from '../mixins/child-node';
import IsRegisteredChild from '../mixins/is-registered-child';

export default Component.extend(ChildNode, IsRegisteredChild, {
  layout,
  childComponentName: computed('model.displayType', function() {
    return `input-fields/${this.get('model.displayType')}/show`;
  })
});
