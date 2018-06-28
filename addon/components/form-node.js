import { sort } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/form-node';

export default Component.extend({
  layout,
  sorting: Object.freeze(['index']),

  sortedChildren: sort('model.children', 'sorting')
});
