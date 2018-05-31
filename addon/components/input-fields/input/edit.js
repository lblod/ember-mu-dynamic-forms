import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/input/edit';

export default Component.extend({
  layout,
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('value', value);
    }
  },
  actions: {
    editSolution() {
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, this.get('value'));
    }
  }
});
