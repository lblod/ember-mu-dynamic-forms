export default function isDynamicSubformValueMatch(form, identifier, value) {
  if(!value) return false;

  if(!form.get('key') === identifier)
      return false;

  let matchKind = form.get('matchKind');

  if(!matchKind || matchKind === 'uri')
    return form.get('value') === value;

  if(matchKind === 'boolean')
    return (form.get('value') === 'true') === value;

  if(matchKind === 'uuid')
    return value.get('id') === form.get('value');

  return false;
}
