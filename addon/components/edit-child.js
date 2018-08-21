import { computed } from '@ember/object';
import Component from '@ember/component';
import ChildNode from '../mixins/child-node';
import IsRegisteredChild from '../mixins/is-registered-child';
import layout from '../templates/components/edit-child';

export default Component.extend(IsRegisteredChild, ChildNode, {
  layout,
  childComponentName: computed('model.displayType', function() {
    return `input-fields/${this.get('model.displayType')}/edit`;
  }),
  
  actions: {
    updateValue(value) {
      if( this.solution && this.get('model.identifier') ) {
        this.set(`solution.${this.get('model.identifier')}`, value);
      } else {
        console.log("Tried to set value before solution or identifier was known");
      }
    }
  }
});
