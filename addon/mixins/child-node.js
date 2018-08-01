import { debug } from '@ember/debug';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import isDynamicSubformValueMatch from '../utils/is-dynamic-subform-value-match';
import { A } from '@ember/array';
import { task } from 'ember-concurrency';

export default Mixin.create({
  store: service(),
  oldP: undefined,

  isHasManyType(kind){
    return kind.endsWith('[]');
  },

  pObserver: observer( 'solution', 'model.identifier', function() {
    const oldP = this.get('oldP');
    if( oldP )
      this.removeObserver( `solution.${oldP}`, this, "updateResourceValue" );

    const p = this.get('model.identifier');
    if ( p ) {
      this.addObserver( `solution.${p}`, this, "updateResourceValue" );
      this.set('oldP', p);
    }
    this.updateResourceValue();
  }).on('init'),

  /**
   * Called when either the resource, the property, or the value of
   * the property in the resource, is changed.
   */
  updateResourceValue: async function(){
    const value = await this.get(`solution.${this.get('model.identifier')}`);
    this.set('value', value);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model') && this.get('solution')) {
      this.prepopulateSolution.perform();
    }
  },

  prepopulateSolution: task(function * () {
    const formNode = yield this.get('solution.formNode');
    const path = this.get('model.identifier');
    const pathSegments = path.split('.');
    const typeMap = formNode.get('inputTypeMap');

    const populateSegments = async (filledSegments, restSegments) => {
      if (restSegments.length == 0)
        return;

      const [first, ...rest] = restSegments;
      const newPath = [...filledSegments, first].join('.');
      const kind = typeMap[newPath];
      const prop = `solution.${newPath}`;

      const value = await this.get(prop);
      if(kind && this.isHasManyType(kind) && !value){
        this.set(prop, A());
      }
      else if (kind && !value) {
        debug(`Creating new record of type '${kind}' for path ${prop}`);
        const resource = this.get('store').createRecord(kind, {});
        this.set(prop, resource);
      }
      await populateSegments([...filledSegments, first], rest);
    };

    yield populateSegments([], pathSegments);
  }),

  subform: computed('model.identifier', 'value', 'model.dynamicSubforms.[]', 'model.dynamicSubforms.@each.{key,value}', function() {
    const subform = this.get('model.dynamicSubforms').find(f => {
      return isDynamicSubformValueMatch(f, this.get('model.identifier'), this.get('value'));
    });
    return subform;
  })
});
