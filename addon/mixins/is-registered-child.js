import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // register ourselves with our parent if necessary
  init() {
    this._super(...arguments);
    if( this.register ) {
      this.register( this );
    }
  }
});
