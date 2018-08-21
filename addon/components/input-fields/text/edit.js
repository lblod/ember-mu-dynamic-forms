import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/text/edit';

export default Component.extend({
  layout,
  internalValue: oneWay('value'),
  actions: {
    update() {
      this.updateValue( this.internalValue );
    }
  }
});
