/*
*
* Create and export configuration varaibles
*
*/

// Container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
  'port': 3000,
  'envName': 'staging'
};

// Production environment
environments.production = {
  'port': 5000,
  'envName': 'production'
};

// Determine which environment was passed as a command-line argunment
var currentEnvironment =  typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment above, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
