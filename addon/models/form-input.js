import DS from 'ember-data';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  index: attr(),
  label: attr(),
  displayType: attr(),
  options: attr('json'),
  identifier: attr(),
  dynamicSubforms: hasMany('dynamic-subform'),
  inputStates: hasMany('input-state')
});
