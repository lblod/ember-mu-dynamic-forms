import { A } from '@ember/array';
import { alias } from '@ember/object/computed';
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
  everyKeys: computed('childComponent.everyKeys{,.[]}','subForm.everyKeys{,.[]}', function(){
    const childKeys = this.get('childComponent.everyKeys') || [];
    const subFormKeys = this.get('subForm.everyKeys') || [];

    // NOTE: we deliberately emit a new key here, so we can do
    // an @each on a higher level on this complete object
    return A([ ...childKeys, ...subFormKeys ]).uniq();
  }),
    
  anyKeys: computed('childComponent.anyKeys{,.[]}', 'subForm.anyKeys{,.[]}', function(){
    const childKeys = this.get('childComponent.anyKeys') || [];
    const subFormKeys = this.get('subForm.anyKeys') || [];

    // NOTE: we deliberately emit a new key here, so we can do
    // an @each on a higher level on this complete object
    return A(childKeys).filter( (childKey) => subFormKeys.includes( childKey ) );
  }),
  
  actions: {
    updateValue(value) {
      if( this.solution && this.get('model.identifier') ) {
        this.set(`solution.${this.get('model.identifier')}`, value);
      } else {
        // TODO: we could cache the value and save it once the identifier became known
        console.log("Tried to set value before solution or identifier was known");
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
