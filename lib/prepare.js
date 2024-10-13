(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, plain, praise, reverse, rpr, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('create-westcoast/prepare'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  //===========================================================================================================
  help('Ω___1', __filename);

}).call(this);

//# sourceMappingURL=prepare.js.map