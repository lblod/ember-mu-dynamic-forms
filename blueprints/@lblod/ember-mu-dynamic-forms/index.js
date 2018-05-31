/* eslint-env node */
const fs = require('fs');
const path = require('path');

module.exports = {
  description: 'default bleuprint for dynamic-forms',
  normalizeEntityName() { },

  async afterInstall(options) {
    let blueprint = '@lblod/ember-mu-dynamic-forms-export-form-solution';
    let blueprintTask = this.taskFor('generate-from-blueprint');
    let params = {
      args: [blueprint, 'form-solution'],
      dryRun: false,
      verbose: true,
      disableAnalytics: false
    };
    await blueprintTask.run(params);
  }
};
