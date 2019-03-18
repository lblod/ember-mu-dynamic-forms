import EmberObject from '@ember/object';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Mixin.create({

  // assume a property exists to denote the models for the registered
  // children named 'registeredChildrenModels'
  init() {
    this._super(...arguments);
    this.set('childComponentsBuffer', A());
  },

  // childComponents will contain all the child components
  childComponents: computed( 'registeredChildrenModels.[]', 'childComponentsBuffer.[]', function() {
    const registeredChildrenModels = this.registeredChildrenModels || [];
    const childComponentsBuffer = this.childComponentsBuffer || [];

    return A(registeredChildrenModels
             .map( (child) => childComponentsBuffer.findBy( 'child', child ) )
             .filter( (element) => element && true ));
  }),

  actions: {
    // This action must be supplied to the nested form with the child
    // filled in with the corresponding model.
    registerChild( child, component ) {
      const livingChildren = this.childComponentsBuffer.filter( (component) => ! component.isDestroyed );
      const newChild = EmberObject.create({ child, component });
      const newLivingChildren = A([ newChild, ...livingChildren ]);
      this.set( 'childComponentsBuffer', newLivingChildren );
    }
  }
});
