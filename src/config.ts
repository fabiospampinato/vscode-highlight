
/* IMPORT */

const configFile = require('./settings.json');

/* CONFIG */

const Config = {

  get() {

    return configFile;

  }

};

/* EXPORT */

export default Config;
