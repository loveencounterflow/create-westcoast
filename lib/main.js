(async function() {
  'use strict';
  var $, CLK, Create, ExecaError, FS, GUY, PATH, Stepper, ask, cfg, copy, create, echo, execa, get_filetype, get_types, help, inspect, log, reverse, rpr, source_base, target_base, version, warn;

  //===========================================================================================================
  GUY = require('guy');

  ({rpr, inspect, echo, reverse} = GUY.trm);

  //...........................................................................................................
  FS = require('node:fs');

  PATH = require('node:path');

  ({execa, $, ExecaError} = require('execa'));

  CLK = require('@clack/prompts');

  ({get_types} = require('./types'));

  //...........................................................................................................
  log = function(...P) {
    return echo(GUY.trm.grey('│ '), GUY.trm.lime(...P));
  };

  warn = function(...P) {
    return echo(GUY.trm.grey('│ '), GUY.trm.red(...P));
  };

  help = function(...P) {
    return echo(GUY.trm.grey('│ '), GUY.trm.gold(...P));
  };

  ask = function(...P) {
    return GUY.trm.gold(...P);
  };

  //-----------------------------------------------------------------------------------------------------------
  get_filetype = function(path) {
    var error, stats;
    try {
      (stats = FS.statSync(path));
    } catch (error1) {
      error = error1;
      if (error.code === 'ENOENT') {
        return 'none';
      }
      if (error.code === 'ELOOP') {
        return 'other';
      }
      throw error;
    }
    if (stats.isDirectory()) {
      return 'folder';
    }
    if (stats.isFile()) {
      return 'file';
    }
    return 'other';
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
            echo('Ω___1', GUY.trm.reverse(key));
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
    constructor() {
      super();
      /* TAINT use types */
      this.cfg = {};
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    intro() {
      CLK.intro("create-westcoast");
      this.cfg.initial_cwd = process.cwd();
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    async create_app_folder() {
      var cfg;
      cfg = {
        message: ask("In which folder should the WestCoast app be created?"),
        placeholder: "folder name",
        initialValue: "my-westcoast-app",
        validate: function(value) {
          if (value.length === 0) {
            // debug 'Ω___2', rpr value
            return "Value is required!";
          }
          return null;
        }
      };
      while (true) {
        this.cfg.app_base_path = PATH.resolve(process.cwd(), (await CLK.text(cfg)));
        echo('Ω___3', "filetype:", get_filetype(this.cfg.app_base_path));
        switch (get_filetype(this.cfg.app_base_path)) {
          case 'folder':
            warn(this.cfg.app_base_path);
            warn("is an existing folder");
            if ((await CLK.confirm({
              message: ask("do you want to create the app in the existing folder?")
            }))) {
              break;
            }
            continue;
          case 'file':
            warn(this.cfg.app_base_path);
            warn("is an existing file");
            help("please choose another name");
            continue;
          case 'other':
            warn(this.cfg.app_base_path);
            warn("is an existing file system object, but not a folder");
            help("please choose another name");
            continue;
          case 'none':
            help(`creating folder ${this.cfg.app_base_path}`);
            FS.mkdirSync(this.cfg.app_base_path);
        }
        break;
      }
      log(`app will be created in ${this.cfg.app_base_path}`);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    cd_to_app_base_path() {
      process.chdir(this.cfg.app_base_path);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    outro() {
      process.chdir(this.cfg.initial_cwd);
      /* not strictly needed */      CLK.outro("create-westcoast");
      return null;
    }

  };

  await (new Create())._run();

  create = async function() {
    var d, error, ref, ref1, ref2;
    debug('Ω___4', $);
    debug('Ω___5', (await $`ls`));
    ref = execa`ls`;
    for await (d of ref) {
      // debug 'Ω___6', rpr d for d from await $"ls"
      info('Ω___7', rpr(d));
    }
    try {
      ref1 = execa`ls nosuch`;
      for await (d of ref1) {
        debug('Ω___8', rpr(d));
      }
    } catch (error1) {
      error = error1;
      if (!(error instanceof ExecaError)) {
        throw error;
      }
      warn('Ω___9', error.cwd, rpr(error.command), em((ref2 = error.code) != null ? ref2 : ''));
      urge('Ω__10', em(error.originalMessage));
      help('Ω__11', em(error.shortMessage));
      warn('Ω__12', em(error.message));
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
  //     help 'Ω__13', rpr line
  //   return null

  // await demo_execa()
  warn("Ω__14 stop");

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
    info('Ω__15', `${source} -> ${target}`);
    try {
      FS.cpSync(source, target, cfg.cp);
    } catch (error1) {
      error = error1;
      if (error.code !== 'ERR_FS_CP_EEXIST') {
        throw error;
      }
      warn('Ω__16', em(error.message));
      process.exit(111);
    }
    return null;
  };

  //===========================================================================================================
  create = function() {
    var i, len, ref, source, target;
    urge('Ω__17', `helo from create-westcoast v${version}`);
    urge('Ω__18', `cfg.source.path.base:    ${cfg.source.path.base}`);
    urge('Ω__19', `cfg.source.path.public:  ${cfg.source.path.public}`);
    urge('Ω__20', `cfg.target.path.base:    ${cfg.target.path.base}`);
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