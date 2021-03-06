import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  findHasMany(store, snapshot, url, relationship) {
    let id = snapshot.id;
    let type = snapshot.modelName;

    url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

    let options = { data: {} };
    if (relationship.key == 'children') {
      options.data['page'] = { size: 10000 };
    }

    return this.ajax(url, 'GET', options);
  }
});
