#!/usr/bin/env node
(function() {
  //!/usr/bin/env node
  'use strict';
  var FS, GUY, alert, cfg, debug, echo, glob, help, info, inspect, log, plain, praise, reverse, rpr, urge, warn, whisper, write_symlink_list;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('create-westcoast/prepare'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  //...........................................................................................................
  FS = require('node:fs');

  // PATH                        = require 'node:fs'
  glob = require('glob');

  ({cfg} = require('..'));

  //===========================================================================================================
  // FS.symlinkSync

  //===========================================================================================================
  write_symlink_list = function() {
    help('Ω___1', __filename);
    help('Ω___2', cfg);
    help('Ω___3', cfg.source.path.public);
    help('Ω___4', glob.sync);
    help('Ω___5', glob.sync(cfg.source.path.public));
    return null;
  };

  //===========================================================================================================
  module.exports = {write_symlink_list};

}).call(this);

//# sourceMappingURL=write-symlink-list-script.js.map