import { debug } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import isDynamicSubformValueMatch from '../utils/is-dynamic-subform-value-match';
import { A } from '@ember/array';
import layout from '../templates/components/root-form-node';
import { alias } from '@ember/object/computed';

const flatten = function(arr) {
  return [].concat(...arr);
};

const isHasManyType = function(kind){
  return kind.endsWith('[]');
};

const walkFormNode = async (node) => {
  const formInputs = await node.get('children');
  const walkedInputs = await Promise.all(formInputs.map(async (input) => {
    const subforms = await input.get('dynamicSubforms');
    const walkedSubformNodes = await Promise.all(subforms.map(async (subform) => {
      const formNode = await subform.get('formNode');
      return walkFormNode(formNode);
    }));
    return [input.get('identifier'), ...flatten(walkedSubformNodes)];
  }));
  return flatten(walkedInputs);
};

/**
 * Similar to walkFormNode, but only walks the form nodes which have
 * allready been fetched from the backend.  This is sufficient for
 * saving, as all values which we may have altered, must have been
 * fetched in the database.  This must therefore also be a superset of
 * all the currently displayed values.
 */
const walkPeekedFormNode = (node) => {
  const formInputs = node.hasMany('children').value() || [];
  const walkedInputs = formInputs.map( (input) => {
    const subforms = input.hasMany('dynamicSubforms').value() || [];
    const walkedSubformNodes =
          subforms
          .filter( (subform) => subform.belongsTo('formNode').value != null )
          .map( (subform) => {
            const formNode = subform.belongsTo('formNode').value();
            return walkPeekedFormNode( formNode );
          } );
    return [input.get('identifier'), ...flatten(walkedSubformNodes)];
  } );
  return flatten( walkedInputs );
};

const walkDisplayedFormNodes = async (node, solution) => {
  const formInputs = await node.get('children');
  const walkedInputs = await Promise.all(formInputs.map(async (input) => {
    const subforms = await input.get('dynamicSubforms');
    const walkedSubformNodes = await Promise.all(subforms.map(async (subform) => {
      const key = subform.get('key');
      const currentValue = solution.get(key);
      if (isDynamicSubformValueMatch(subform, key, currentValue)) {
        const formNode = await subform.get('formNode');
        return walkDisplayedFormNodes(formNode, solution);
      } else {
        return [];
      }
    }));
    return [input.get('identifier'), ...flatten(walkedSubformNodes)];
  }));
  return flatten(walkedInputs);
};

export default Component.extend({
  layout,
  store: service(),

  model: alias('solution.formNode'),

  async save() {
    const model = await this.model;
    const solution = await this.solution;

    const displayedProperties = await walkDisplayedFormNodes(model, solution);
    displayedProperties.sort((a, b) => a.length < b.length);

    // by fetching the properties *after* fetchin the
    // displayedProperties, we know all content for currently shown
    // values must have been fetched from the database.
    debug("getting peeked form nodes");
    const properties = walkPeekedFormNode(model);
    properties.sort((a, b) => a.length < b.length);
    debug('Calculated all property paths');

    const nonDisplayedProperties = properties.filter(x => !displayedProperties.includes(x));
    debug('Calculated all displayed/non-displayed property paths');

    const expandedDisplayedProperties = {};
    displayedProperties.forEach((prop) => {
      const pathSegments = prop.split('.');

      while(pathSegments.length) {
        const key = pathSegments.join('.');
        expandedDisplayedProperties[key] = true;
        pathSegments.pop();
      }
    });
    debug('Calculated all expanded property paths');

    const inputTypeMap = this.get('model.inputTypeMap');

    nonDisplayedProperties.forEach((prop) => {
      const pathSegments = prop.split('.');

      while(pathSegments.length) {
        const key = pathSegments.join('.');

        if(!expandedDisplayedProperties[key]) {
          const kind = inputTypeMap[key];
          try {
            const value = kind && isHasManyType(kind) ? A() : null;
            this.set(`solution.${key}`, value);
          } catch (e) {
            debug(`Couldn't set prop ${key}: ${e.message}`);
          }
        }
        pathSegments.pop();
      }
    });
    debug('Resetted the value of all non-displayed properties');

    // In order to save the solutions, we should save the most deeply
    // nested resources first, then the parent resources.  Otherwise,
    // there may be items without an id.  We save these items as a
    // map, so they're easy to fill and so we can attach the resource
    // to be saved to the map.  Later we take the keys of this map and
    // sort them by string length (longest first).  This ensures we
    // save the most deeply nested objects first.  It also ensures we
    // don't save a resource at the same key more than once.

    // In contrast to earlier solutions, the current solution first
    // determines all the keys to save, orders them by length, and
    // saves the items from there on.  This helps us not save
    // duplicate values.
    const resourcesToSave = {};

    for(let i = 0; i < displayedProperties.length; i++) {
      const prop = displayedProperties[i];
      const propSegments = prop.split('.');

      const fillResourcesToSave = async (path) => {
        if (path.length == 0)
          return;

        const key = path.join('.');
        const kind = inputTypeMap[key];
        if (kind) {
          const resource = await this.get(`solution.${key}`);
          if (resource) {
            resourcesToSave[key] = resource;
            debug(`Saved resource at property path ${key}`);
          }
        }
        path.pop();
        await fillResourcesToSave(path);
      };

      await fillResourcesToSave(propSegments);
    }

    const sortedResourcesToSaveKeys = [];
    // map.keys does not exist in IE11
    for(let key in resourcesToSave) {
      sortedResourcesToSaveKeys.push( key );
    }
    // sort longest keys first
    sortedResourcesToSaveKeys.sort((a, b) => a.length > b.length);
    // execute the saving of the related resource
    for(let i = 0; i < sortedResourcesToSaveKeys.length; i++) {
      const resourceToSaveKey = sortedResourcesToSaveKeys[i];
      const resourceToSave = resourcesToSave[resourceToSaveKey];
      await resourceToSave.save();
    }

    // save the top-level solution
    await this.get('solution').save();
    debug('Saved solution');
    return this.get('solution');
  },

  didInsertElement(){
    this._super(...arguments);
    this.get('onDynamicFormInit')(this);
  },

  actions: {
    registerFormNode( formNode ) {
      this.set("formNode", formNode );
    }
  }
});
