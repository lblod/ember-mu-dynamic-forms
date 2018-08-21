import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/input/edit';
import InputField from '../../../mixins/input-field';

export default Component.extend( InputField, {
  layout,

  actions: {
    editSolution() {
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, this.get('value'));
    }
  }
});
