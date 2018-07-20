import { debug } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { alias } from '@ember/object/computed';
import layout from '../../../templates/components/input-fields/dynamic-select/edit';

export default Component.extend({
  layout,
  store: service(),

  //TODO parse these options
  allowClear: true,
  disabled: false,

  displayProperty: alias('model.options.displayProperty'),
  queryModel: alias('model.options.queryModel'),

  async init() {
    this._super(...arguments);

    const options = await this.search.perform();
    this.set('initialOptions', options);
  },

  async didReceiveAttrs(){
    this._super(...arguments);

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
  search: task(function* (searchData){
    if (searchData)
      yield timeout(300);

    const queryParams = this.get('model.options.filter.queryParams');
    queryParams['page'] = { size: 200 };
    if (searchData)
      queryParams[this.get('model.options.filter.filterKey')] = searchData;

    const resources = yield this.get('store').query(this.queryModel, queryParams);
    return resources;
  }).keepLatest(),

  actions: {
    select(object_instance){
      this.set('object_instance', object_instance);
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, object_instance);
    }
  }
});
