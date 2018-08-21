import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/form-node';
import HasRegisteredChildren from '../mixins/has-registered-children';

export default Component.extend( HasRegisteredChildren, {
  layout,
  sorting: Object.freeze(['index']),

  sortedChildren: sort('model.children', 'sorting'),
  registeredChildrenModels: alias( 'sortedChildren' ),

  intersectionStates: computed('childComponentInstances{.@each.intersectionStates,.[],}', function(){
    if (this.childComponentInstances.length == 0) {
      // no child components, hence no states possible
      return [];
    } else {
      // NOTE: we deliberately emit a new key here, so we can do
      // an @each on a higher level on this complete object

      // calculate the intersection of all states
      return this.childComponentInstances
        .map( (childComponent) => childComponent.intersectionStates || [] )
        .reduce( (oldStates, newStates) => {
          return oldStates.filter( (oldState) => newStates.find( (s) => s == oldState ) );
        });
    }
  }),

  unionStates: computed('childComponentInstances{.@each.unionStates,.[],}', function(){
    // NOTE: we deliberately emit a new key here, so we can do
    // an @each on a higher level on this complete object
    if (this.childComponentInstances.length == 0) {
      return [];
    } else {
      const union = this.childComponentInstances
            .map( (childComponent) => childComponent.unionStates || [] )
            .reduce( (oldStates, newStates) => oldStates.concat( newStates ) )
            .uniq();
      return union;
    }
  }),

  childComponentInstances: computed('childComponents.[]', 'childComponents.@each.component', function() {
    return this.childComponents.map( ({component}) => component );
  }),

  init() {
    this._super(...arguments);
    if( this.register ){
      this.register( this );
    }
  }
});
