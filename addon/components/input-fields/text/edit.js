import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/text/edit';
import InputField from '../../../mixins/input-field';

export default Component.extend( InputField, {
  layout,
  internalValue: oneWay('value'),

  actions: {
    update() {
      console.log(`Updating value to ${this.internalValue}`);
      this.updateValue( this.internalValue );
    }
  }
});
