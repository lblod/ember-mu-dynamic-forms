import DS from 'ember-data';

export default DS.Model.extend({
  validationName: DS.attr(), //e.g "empty"
  stateName: DS.attr() // e.g. "noSend" -> if state empty
});
