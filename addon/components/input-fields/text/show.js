import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../../templates/components/input-fields/text/show';
import InputField from '../../../mixins/input-field';

export default Component.extend( InputField, {
  layout,
  internalValue: oneWay('value')
});
