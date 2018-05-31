import { computed } from '@ember/object';
import Component from '@ember/component';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import isDynamicSubformValueMatch from '../utils/is-dynamic-subform-value-match';
import { A } from '@ember/array';
import layout from '../templates/components/edit-child';

export default Component.extend({
  layout,
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
  updateResourceValue: function(){
    const value = this.get(`solution.${this.get('model.identifier')}`);
    this.set('value', value);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model') && this.get('solution')) {
      this.get('solution.formNode').then((formNode) => {
        const path = this.get('model.identifier');
        const pathSegments = path.split('.');
        const typeMap = formNode.get('inputTypeMap');

        const populateSegments = (filledSegments, restSegments) => {
          if (restSegments.length == 0)
            return;

          const [first, ...rest] = restSegments;
          const newPath = [...filledSegments, first].join('.');
          const kind = typeMap[newPath];
          const prop = `solution.${newPath}`;
          // TODO shouldn't we await this.get(prop) ?
          if(kind && this.isHasManyType(kind) && !this.get(prop).content){
            this.set(prop, A());
          }
          else if (kind && !this.get(prop).content) {
            const resource = this.get('store').createRecord(kind, {});
            this.set(prop, resource);
          }
          populateSegments([...filledSegments, first], rest);
        };

        populateSegments([], pathSegments);
      });
    }
  },

  subform: computed('model.identifier', 'value', 'model.dynamicSubforms.[]', 'model.dynamicSubforms.@each.{key,value}', function() {
    const subform = this.get('model.dynamicSubforms').find(f => {
      return isDynamicSubformValueMatch(f, this.get('model.identifier'), this.get('value'));
    });
    return subform;
  }),

  childComponentName: computed('model.displayType', function() {
    return `input-fields/${this.get('model.displayType')}/edit`;
  })
});
