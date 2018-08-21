import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/form-node';
import HasRegisteredChildren from '../mixins/has-registered-children';

export default Component.extend( HasRegisteredChildren, {
  layout,
  sorting: Object.freeze(['index']),

  sortedChildren: sort('model.children', 'sorting'),
  registeredChildrenModels: alias( 'sortedChildren' )
});
