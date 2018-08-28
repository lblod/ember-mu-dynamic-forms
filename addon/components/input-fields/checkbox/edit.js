import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/checkbox/edit';
import InputField from '../../../mixins/input-field';

export default Component.extend( InputField, {
  layout,
  internalValue: oneWay('value'),

  activeInputStates: computed( function() {
    return [];
  }),

  actions: {
    toggleValue() {
      this.updateValue( !this.get('internalValue') );
    }
  }
});
