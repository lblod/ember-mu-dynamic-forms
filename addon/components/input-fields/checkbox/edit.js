import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/checkbox/edit';

export default Component.extend({
  layout,

  init() {
    this._super(...arguments);
    if( this.register ){
      this.register(this);
    }
    this.get('model.inputStates').then( (inputStates) => {
      this.set('inputStates', inputStates);
    } );
  },
  
  activeInputStates: computed( 'inputStates.[]', 'value', function() {
    const inputStates = this.inputStates;
    const value = this.value;

    return ["checkbox"];

    return inputStates
      .map(function( inputState ) {
        switch (inputState.validationName) {
          case "empty":
            return value == undefined;
          default:
            return undefined;
            console.log(`Do not know how to process ${inputState.validationName}`);
        }})
      .filter( (i) => i );
  } ),

  everyKeys: alias('activeInputStates'),
  anyKeys: alias('activeInputStates'),

  actions: {
    toggleValue() {
      this.updateValue( !this.get('value') );
    }
  }
});
