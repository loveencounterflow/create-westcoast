(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, plain, praise, reverse, rpr, urge, version, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('create-westcoast'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  //===========================================================================================================
  ({version} = require('../package.json'));

  urge('Ω___1', `helo from create-westcoast v${version}`);

  urge('Ω___2', `CWD is ${process.cwd()}`);

}).call(this);

//# sourceMappingURL=main.js.map