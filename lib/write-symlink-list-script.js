#!/usr/bin/env node
(function() {
  //!/usr/bin/env node
  'use strict';
  var FS, GUY, PATH, alert, cfg, debug, echo, glob, help, info, inspect, log, plain, praise, reverse, rpr, urge, warn, whisper, write_symlink_list;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('create-westcoast/prepare'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  //...........................................................................................................
  FS = require('node:fs');

  PATH = require('node:path');

  glob = require('glob');

  ({cfg} = require('..'));

  //===========================================================================================================
  // FS.symlinkSync

  //===========================================================================================================
  write_symlink_list = function() {
    var R, i, len, ref, source, target;
    // help 'Ω___1', __filename
    // help 'Ω___2', cfg
    // help 'Ω___3', cfg.source.path.public
    // help 'Ω___4', glob.sync
    R = [];
    ref = glob.sync(cfg.symlink_glob);
    for (i = 0, len = ref.length; i < len; i++) {
      target = ref[i];
      if (!(FS.lstatSync(target)).isSymbolicLink()) {
        continue;
      }
      source = FS.realpathSync(target);
      source = PATH.relative(cfg.source.path.base, source);
      target = PATH.relative(cfg.source.path.base, target);
      info('Ω___5', `${source} -> ${target}`);
      R.push({source, target});
    }
    // help 'Ω___6', cfg.data.path
    // help 'Ω___7', cfg.data.linklist.path
    FS.writeFileSync(cfg.data.linklist.path, JSON.stringify(R, null, '  '));
    return null;
  };

  //===========================================================================================================
  module.exports = {write_symlink_list};

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      return write_symlink_list();
    })();
  }

}).call(this);

//# sourceMappingURL=write-symlink-list-script.js.map