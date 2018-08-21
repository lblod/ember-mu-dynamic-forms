import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/checkbox/edit';

export default Component.extend({
  layout,
  
  actions: {
    toggleValue() {
      this.updateValue( !this.get('value') );
    }
  }
});
