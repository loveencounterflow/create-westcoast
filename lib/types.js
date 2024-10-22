(function() {
  'use strict';
  var GUY, Intertype, debug, types;

  //===========================================================================================================
  GUY = require('guy');

  ({debug} = GUY.trm.get_loggers('create-westcoast/types'));

  //...........................................................................................................
  ({Intertype} = require('intertype'));

  types = null;

  //===========================================================================================================
  this.get_types = function() {
    if (types == null) {
      types = new Intertype();
      //.......................................................................................................
      if (!Reflect.has(types.declarations, 'class')) {
        types.declare({
          class: function(x) {
            var ref;
            return ((Object.prototype.toString.call(x)) === '[object Function]') && ((ref = Object.getOwnPropertyDescriptor(x, 'prototype')) != null ? ref.writable : void 0) === false;
          }
        });
      }
    }
    //.........................................................................................................
    return types;
  };

}).call(this);

//# sourceMappingURL=types.js.map