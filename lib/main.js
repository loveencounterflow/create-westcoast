(function() {
  'use strict';
  var $, ExecaError, FS, GUY, PATH, alert, cfg, copy, create, debug, echo, em, execa, help, info, inspect, log, plain, praise, reverse, rpr, source_base, target_base, urge, version, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('create-westcoast'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  //...........................................................................................................
  em = function(...P) {
    return GUY.trm.reverse(GUY.trm.bold(...P));
  };

  //...........................................................................................................
  FS = require('node:fs');

  PATH = require('node:path');

  ({execa, $, ExecaError} = require('execa'));

  create = async function() {
    var d, error, ref, ref1, ref2;
    debug('Ω___1', $);
    debug('Ω___2', (await $`ls`));
    ref = execa`ls`;
    for await (d of ref) {
      // debug 'Ω___3', rpr d for d from await $"ls"
      info('Ω___4', rpr(d));
    }
    try {
      ref1 = execa`ls nosuch`;
      for await (d of ref1) {
        debug('Ω___5', rpr(d));
      }
    } catch (error1) {
      error = error1;
      if (!(error instanceof ExecaError)) {
        throw error;
      }
      warn('Ω___6', error.cwd, rpr(error.command), em((ref2 = error.code) != null ? ref2 : ''));
      urge('Ω___7', em(error.originalMessage));
      help('Ω___8', em(error.shortMessage));
      warn('Ω___9', em(error.message));
    }
    return null;
  };

  module.exports = {create};

  // demo_zx = ->
  //   count = 0
  //   # for await line from execa"cat /usr/share/dict/ngerman"
  //   zx_cd '/home/flow/jzr/bing-image-creator-downloader'
  //   for await line from execa"python3.11 ./main.py"
  //     count++; break if count > 10000
  //     help 'Ω__22', rpr line
  //   return null

  // await demo_execa()
  warn("Ω__23 stop");

  return null;

  //===========================================================================================================
  ({version} = require('../package.json'));

  source_base = PATH.resolve(__dirname, '../');

  target_base = process.cwd();

  //===========================================================================================================
  cfg = (() => {
    var R;
    R = {
      data: {
        path: PATH.resolve(source_base, 'data')
      },
      source: {
        path: {
          base: source_base,
          public: PATH.resolve(source_base, 'public')
        }
      },
      target: {
        path: {
          base: target_base,
          public: PATH.resolve(target_base, 'public')
        }
      },
      cp: {
        errorOnExist: true,
        dereference: true,
        force: false,
        preserveTimestamps: true,
        recursive: true
      }
    };
    R.symlink_glob = PATH.join(R.source.path.public, '**');
    R.data.linklist = {
      path: PATH.resolve(R.data.path, 'linklist.json')
    };
    return R;
  })();

  //===========================================================================================================
  copy = function(source, target) {
    var error;
    info('Ω__24', `${source} -> ${target}`);
    try {
      FS.cpSync(source, target, cfg.cp);
    } catch (error1) {
      error = error1;
      if (error.code !== 'ERR_FS_CP_EEXIST') {
        throw error;
      }
      warn('Ω__25', em(error.message));
      process.exit(111);
    }
    return null;
  };

  //===========================================================================================================
  create = function() {
    var i, len, ref, source, target;
    urge('Ω__26', `helo from create-westcoast v${version}`);
    urge('Ω__27', `cfg.source.path.base:    ${cfg.source.path.base}`);
    urge('Ω__28', `cfg.source.path.public:  ${cfg.source.path.public}`);
    urge('Ω__29', `cfg.target.path.base:    ${cfg.target.path.base}`);
    //.........................................................................................................
    copy(cfg.source.path.public, cfg.target.path.public);
    ref = require(cfg.data.linklist.path);
    //.........................................................................................................
    for (i = 0, len = ref.length; i < len; i++) {
      ({source, target} = ref[i]);
      source = PATH.resolve(cfg.source.path.base, source);
      target = PATH.resolve(cfg.target.path.base, target);
      copy(source, target);
    }
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  module.exports = {cfg, create};

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      return create();
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map