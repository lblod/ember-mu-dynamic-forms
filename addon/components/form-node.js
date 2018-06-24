import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/form-node';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  layout,
  store: service(),
  sorting: Object.freeze(['index']),

  allChildren: computed('model.children', function(){
    return this.getAllChildren.perform();
  }),

  sortedChildren: sort('model.children', 'sorting'),

  getAllChildren: task(function* (){
    //TODO: move this to adaptor
    let modelName = (yield this.get('model')).constructor.modelName;
    let data = yield this.get('store').query(modelName, {
      'filter[id]': this.get('model.id'),
      'include': 'children'
    });
    return yield data.firstObject.get('children');
  })
});
