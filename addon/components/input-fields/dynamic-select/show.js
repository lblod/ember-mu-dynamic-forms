import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/dynamic-select/show';

export default Component.extend({
  layout,
  async didReceiveAttrs(){
    this._super(...arguments);
    let options = this.get('model.options');
    this.set('displayProperty', options.displayProperty);

    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('object_instance', value);
    }
  }
});
