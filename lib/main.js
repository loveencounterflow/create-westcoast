(async function() {
  'use strict';
  var $, CLK, Create, ExecaError, FS, GUY, PATH, Stepper, alert, cfg, copy, create, debug, echo, execa, get_types, help, info, inspect, log, plain, praise, reverse, rpr, source_base, target_base, urge, version, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('create-westcoast'));

  ({rpr, inspect, echo, reverse} = GUY.trm);

  //...........................................................................................................
  FS = require('node:fs');

  PATH = require('node:path');

  ({execa, $, ExecaError} = require('execa'));

  CLK = require('@clack/prompts');

  ({get_types} = require('./types'));

  //...........................................................................................................
  log = function(...P) {
    return echo(GUY.trm.grey('│ '), ...P);
  };

  //===========================================================================================================
  Stepper = class Stepper {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      GUY.props.hide(this, '_types', get_types());
      GUY.props.hide(this, '_transforms', []);
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    // [Symbol.iterator]: -> yield from @_transforms

      //---------------------------------------------------------------------------------------------------------
    async _run() {
      var chain, i, key, len, method, object, ref, ref1;
      chain = (GUY.props.get_prototype_chain(this)).reverse();
      for (i = 0, len = chain.length; i < len; i++) {
        object = chain[i];
        ref = GUY.props.walk_keys(object, {
          hidden: true,
          builtins: false,
          depth: 0
        });
        for (key of ref) {
          if (key === 'constructor') {
            continue;
          }
          if (key === 'length') {
            continue;
          }
          if (key.startsWith('_')) {
            continue;
          }
          ref1 = this._walk_values(object[key]);
          for (method of ref1) {
            if (!((this._types.isa.function(method)) || (this._types.isa.asyncfunction(method)))) {
              continue;
            }
            // whisper 'Ω___1', key
            await method.call(this);
          }
        }
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    * _walk_values(value) {
      var d, e, i, len, ref;
      if (this._types.isa.class(value)) {
        return (yield new value());
      }
      //.......................................................................................................
      if (this._types.isa.function(value)) {
        if (!((value.name.startsWith('$')) || (value.name.startsWith('bound $')))) {
          return (yield value);
        }
        return (yield value.call(this));
      }
      //.......................................................................................................
      if (this._types.isa.list(value)) {
        for (i = 0, len = value.length; i < len; i++) {
          e = value[i];
          ref = this._walk_values(e);
          for (d of ref) {
            yield d;
          }
        }
        return null;
      }
      //.......................................................................................................
      return (yield value);
    }

  };

  //===========================================================================================================
  Create = class Create extends Stepper {
    //---------------------------------------------------------------------------------------------------------
    intro() {
      CLK.intro("create-westcoast");
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    async create_app_folder() {
      var app_base_path, cfg;
      cfg = {
        message: "In which folder should the WestCoast app be created?",
        placeholder: "folder name",
        initialValue: "my-westcoast-app",
        validate: function(value) {
          if (value.length === 0) {
            // debug 'Ω___5', rpr value
            return "Value is required!";
          }
          return null;
        }
      };
      app_base_path = (await CLK.text(cfg));
      app_base_path = PATH.resolve(process.cwd(), app_base_path);
      log(GUY.trm.blue(`app will be created in ${rpr(app_base_path)}`));
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    outro() {
      CLK.outro("create-westcoast");
      return null;
    }

  };

  await (new Create())._run();

  create = async function() {
    var d, error, ref, ref1, ref2;
    debug('Ω___3', $);
    debug('Ω___4', (await $`ls`));
    ref = execa`ls`;
    for await (d of ref) {
      // debug 'Ω___5', rpr d for d from await $"ls"
      info('Ω___6', rpr(d));
    }
    try {
      ref1 = execa`ls nosuch`;
      for await (d of ref1) {
        debug('Ω___7', rpr(d));
      }
    } catch (error1) {
      error = error1;
      if (!(error instanceof ExecaError)) {
        throw error;
      }
      warn('Ω___8', error.cwd, rpr(error.command), em((ref2 = error.code) != null ? ref2 : ''));
      urge('Ω___9', em(error.originalMessage));
      help('Ω__10', em(error.shortMessage));
      warn('Ω__11', em(error.message));
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
  //     help 'Ω__12', rpr line
  //   return null

  // await demo_execa()
  warn("Ω__13 stop");

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
    info('Ω__14', `${source} -> ${target}`);
    try {
      FS.cpSync(source, target, cfg.cp);
    } catch (error1) {
      error = error1;
      if (error.code !== 'ERR_FS_CP_EEXIST') {
        throw error;
      }
      warn('Ω__15', em(error.message));
      process.exit(111);
    }
    return null;
  };

  //===========================================================================================================
  create = function() {
    var i, len, ref, source, target;
    urge('Ω__16', `helo from create-westcoast v${version}`);
    urge('Ω__17', `cfg.source.path.base:    ${cfg.source.path.base}`);
    urge('Ω__18', `cfg.source.path.public:  ${cfg.source.path.public}`);
    urge('Ω__19', `cfg.target.path.base:    ${cfg.target.path.base}`);
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