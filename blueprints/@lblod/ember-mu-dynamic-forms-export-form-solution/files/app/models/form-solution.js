import FormSolution from '@lblod/ember-mu-dynamic-forms/models/form-solution' ;
import { belongsTo } from 'ember-data/relationships';

export default FormSolution.extend({
  //Add the relation to the model of which the dynamic form will belong.
  //e.g. company: belongsTo('company'),
});
