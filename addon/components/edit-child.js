import { warn } from '@ember/debug';
import { A } from '@ember/array';
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
  intersectionStates: computed('childComponent.intersectionStates{,.[]}','subForm.intersectionStates{,.[]}', function(){
    const childKeys = this.get('childComponent.intersectionStates') || [];
    const subFormKeys = this.get('subForm.intersectionStates') || [];

    // NOTE: we deliberately emit a new key here, so we can do
    // an @each on a higher level on this complete object
    if ( this.subForm  ) {
      return A(childKeys).filter( (childKey) => subFormKeys.includes( childKey ) );
    } else {
      return childKeys;
    }
  }),

  unionStates: computed('childComponent.unionStates{,.[]}','subForm.unionStates{,.[]}', function(){
    const childKeys = this.get('childComponent.unionStates') || [];
    const subFormKeys = this.get('subForm.unionStates') || [];

    // NOTE: we deliberately emit a new key here, so we can do
    // an @each on a higher level on this complete object
    return A([ ...childKeys, ...subFormKeys ]).uniq();
  }),

  actions: {
    updateValue(value) {
      if( this.solution && this.get('model.identifier') ) {
        this.set(`solution.${this.get('model.identifier')}`, value);
      } else {
        // TODO: we could cache the value and save it once the identifier became known
        warn("Tried to set value before solution or identifier was known");
      }
    },
    registerChildComponent(childComponent){
      this.set('childComponent', childComponent);
    },
    registerSubForm(subForm){
      this.set('subForm', subForm);
    }
  }
});
