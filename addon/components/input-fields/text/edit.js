import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/text/edit';

export default Component.extend({
  layout,
  internalValue: oneWay('value'),

  activeInputStates: computed( 'inputStates.[]', 'value', function() {
    // TODO:stub!!
    const inputStates = this.inputStates;
    const value = this.value;

    console.log( "yielding text-input" );

    return ["text-input"];
  } ),

  everyKeys: alias('activeInputStates'),
  anyKeys: alias('activeInputStates'),

  actions: {
    update() {
      this.updateValue( this.internalValue );
    }
  }
});
