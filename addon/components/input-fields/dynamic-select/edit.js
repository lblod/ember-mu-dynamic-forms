import { debug } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import layout from '../../../templates/components/input-fields/dynamic-select/edit';

export default Component.extend({
  layout,
  store: service(),

  //TODO parse these options
  allowClear: true,
  disabled: false,

  buildQueryParams(options){
    return ( searchString ) => {
      const filter = options.filter.queryParams;
      filter[options.filter.filterKey] = searchString;
      return filter;
    };
  },

  /**
   * The structure of options object should match:
   *
   *   {
   *           "queryModel": "NameOfModel",
   *           "displayProperty": "NameOfPropertyToDisplay",
   *           "filter": {
   *                   "filterKey": "filter[label]",
   *                   "queryParams": {
   *                           "sort": "label"
   *                  }
   *           }
   *   }
   */
  async didReceiveAttrs(){
    this._super(...arguments);
    let options = this.get('model.options');
    this.set('queryModel', options.queryModel);
    this.set('displayProperty', options.displayProperty);
    this.set('queryParams', this.buildQueryParams(options));

    if (this.get('model')) {
      let value = await this.get(`solution.${this.get('model.identifier')}`);

      if (value && value.get('isNew')) { // only already existing options are allowed
        debug(`Reset value of dynamic-select '${this.queryModel}' to null`);
        value.destroyRecord();
        value = null;
        this.set(`solution.${this.get('model.identifier')}`, value);
      }

      this.set('object_instance', value);
    }
  },

  search: task(function* (searchData){
    yield timeout(300);
    const queryParams = this.get('queryParams')(searchData);
    const resources = yield this.get('store').query(this.get('queryModel'), queryParams);
    return resources;
  }),

  actions: {
    select(object_instance){
      this.set('object_instance', object_instance);
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, object_instance);
    }
  }
});
