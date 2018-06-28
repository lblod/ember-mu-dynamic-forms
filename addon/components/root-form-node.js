import { debug } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import isDynamicSubformValueMatch from '../utils/is-dynamic-subform-value-match';
import { A } from '@ember/array';
import layout from '../templates/components/root-form-node';

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

  async save() {
    const properties = await walkFormNode(this.get('model'));
    properties.sort((a, b) => a.length < b.length);
    debug('Calculated all property paths');

    const displayedProperties = await walkDisplayedFormNodes(this.get('model'), this.get('solution'));
    displayedProperties.sort((a, b) => a.length < b.length);
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

    for(let i = 0; i < displayedProperties.length; i++) {
      const prop = displayedProperties[i];
      debug(`Handling displayed property ${prop}`);
      const propSegments = prop.split('.');

      const savePath = async (path) => {
        if (path.length == 0)
          return;

        const key = path.join('.');
        const kind = inputTypeMap[key];
        if (kind) {
          const resource = await this.get(`solution.${key}`);
          if (resource) {
            await resource.save();
            debug(`Saved resource at property path ${key}`);
          }
        }
        path.pop();
        await savePath(path);
      };

      await savePath(propSegments);
    }

    await this.get('solution').save();
    debug('Saved solution');
    return this.get('solution');
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('model', this.get('solution.formNode'));
  },

  didInsertElement(){
    this._super(...arguments);
    this.get('onDynamicFormInit')(this);
  }
});
