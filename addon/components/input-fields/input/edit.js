import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/input/edit';
import InputField from '../../../mixins/input-field';

export default Component.extend( InputField, {
  layout,
  internalValue: oneWay('value'),

  actions: {
    update() {
      this.updateValue( this.internalValue );
    }
  }
});
