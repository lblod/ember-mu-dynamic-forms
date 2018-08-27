import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  init() {
    this._super(...arguments);
    if( this.register ){
      this.register(this);
    }
    this.get('model.inputStates').then( (inputStates) => {
      this.set('inputStates', inputStates);
    } );
  },

  classNameBindings: ['hasEmptyInputState:is-required'],

  hasEmptyInputState: computed('inputStates.[]', function() {
    const inputStates = this.inputStates || [];
    return inputStates.filter((s) => { return s.validationName == 'empty'; }).length > 0;
  }),

  activeInputStates: computed( 'inputStates.[]', 'value', function() {
    const inputStates = this.inputStates || [];

    const value = this.value;

    return inputStates
      .map(function( inputState ) {
        // Yield state name for matching validations
        switch (inputState.validationName) {
          case "empty":
            return isEmpty(value) && inputState.stateName;
          default:
            console.log(`Do not know how to process ${inputState.validationName}`);
            return undefined;
        }})
      // remove all non-truethy validation names
      .filter( (i) => i );
  } ),

  unionStates: alias('activeInputStates'),
  intersectionStates: alias('activeInputStates')
});
