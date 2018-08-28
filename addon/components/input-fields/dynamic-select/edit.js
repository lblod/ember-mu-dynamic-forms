import { debug } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { alias } from '@ember/object/computed';
import layout from '../../../templates/components/input-fields/dynamic-select/edit';
import InputField from '../../../mixins/input-field';
import { oneWay } from '@ember/object/computed';

export default Component.extend( InputField, {
  layout,
  store: service(),
  internalValue: oneWay('value'),

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
      if (this.internalValue && this.internalValue.get('isNew')) { // only already existing options are allowed
        debug(`Reset value of dynamic-select '${this.queryModel}' to null`);
        this.internalValue.destroyRecord();
        this.updateValue( this.internalValue );
      }
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
      this.updateValue( object_instance );
    }
  }
});
