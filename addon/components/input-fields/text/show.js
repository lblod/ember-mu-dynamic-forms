import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/text/show';
import InputField from '../../../mixins/input-field';

export default Component.extend( InputField, {
  layout,
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('value', value);
    }
  }
});
