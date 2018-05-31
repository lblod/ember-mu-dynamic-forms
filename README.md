@lblod/ember-mu-dynamic-forms
==============================================================================

Addon which enables rendering and editing dynamic-forms.
Assumes mu.semte.ch backend.


Installation
------------------------------------------------------------------------------

### In mu-cl-resources

Requires following config in domain.lisp.

```
(in-package :mu-cl-resources)

(define-resource form-node ()
  :class (s-prefix "ext:FormNode")
  :properties `((:input-type-map :string ,(s-prefix "ext:typeMap")))
  :has-many `((form-input :via ,(s-prefix "ext:formInput")
                          :as "children")
              (dynamic-subform :via ,(s-prefix "ext:hasFormNode")
                               :inverse t
                               :as "parents"))
  :resource-base (s-url "http://data.lblod.info/form-nodes/")
  :on-path "form-nodes")

(define-resource form-input ()
  :class (s-prefix "ext:FormInput")
  :properties `((:index :number ,(s-prefix "ext:index"))
                (:display-type :string ,(s-prefix "ext:displayType"))
                (:label :string ,(s-prefix "dct:title"))
                (:options :string ,(s-prefix "ext:string"))
                (:identifier :string ,(s-prefix "adms:identifier")))
  :has-many `((dynamic-subform :via ,(s-prefix "ext:dynamicSubforms")
                               :as "dynamic-subforms"))
  :resource-base (s-url "http://data.lblod.info/form-inputs/")
  :on-path "form-inputs")

(define-resource dynamic-subform ()
  :class (s-prefix "ext:DynamicSubform")
  :properties `((:key :string ,(s-prefix "ext:key"))
                ;; match-kind is defined for resource properties.
                ;; Should be "uri" to match on object's uri property,
                ;; or "uuid" to match on its identifier.
                (:match-kind :string ,(s-prefix "ext:matchKind"))
                (:value :string ,(s-prefix "ext:value")))
  :has-one `((form-node :via ,(s-prefix "ext:hasFormNode")
                        :as "form-node"))
  :resource-base (s-url "http://data.lblod.info/dynamic-subforms/")
  :on-path "dynamic-subforms")

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; The dynamic form needs a form-solution which contains a relation specific to your domain
;;(define-resource form-solution ()
;;  :class (s-prefix "ext:FormSolution")
;;  :properties `((:has-owner :string ,(s-prefix "ext:hasOwnerAsString")))
;;  :has-one `((form-node :via ,(s-prefix "ext:hasForm")
;;                        :as "form-node")
;;
;; This following relation needs to be customized for your domain.
;;             (company :via ,(s-prefix "ext:hasCompany")
;;                      :as "company"))
;;
;;  :resource-base (s-url "http://data.lblod.info/form-solutions/")
;;  :on-path "form-solutions")
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
```

### In Ember

```
ember install @lblod/ember-mu-dynamic-forms
```


Usage
------------------------------------------------------------------------------

This addon adds a model file, form-solution.js in the host app (see blueprints).
This provides an entry point to link the dynamic forms with the model you want to talk about.

Once installed and configured in the host app, the file coud look like e.g. :

```
import FormSolution from '@lblod/ember-mu-dynamic-forms/models/form-solution' ;
import { belongsTo } from 'ember-data/relationships';

export default FormSolution.extend({
  company: belongsTo('company')
});

```
Form components have a show and edit mode.

##### edit-mode

```
  {{root-form-node solution=model onDynamicFormInit=(action "initDynamicForm")}}
```

##### show-mode

```
  {{root-form-node solution=model onDynamicFormInit=(action "initDynamicForm") show=true}}
```

The root-form-node returns itself to the consuming object by calling the actionhandler bound to onDynamicFormInit.
This could look like:

```
  //(...)
  actions: {
       initDynamicForm(dForm){
         this.set('dynamicForm', dForm);
       }
  }

```

Saving the form data, is an async operation and could like:
```
  //(...)
  await this.get('dynamicForm').save();

```
### custom input fields
Custom field can be build.
They need to be located in components/input-fields/your-custom-input-field/edit
The display-type in form-node should match the name of your component.


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-mu-dynamic-forms`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running the dummy application
N/A (for the moment)

### Still to do

* HasMany relations is not properly dealt with. Currently a custom component is required.
* Clearing of dangling objects
* a lot of standard input components


For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
