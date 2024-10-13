

'use strict'

#===========================================================================================================
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'create-westcoast'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
#...........................................................................................................
em                        = ( P... ) -> GUY.trm.reverse GUY.trm.bold P...
#...........................................................................................................
FS                        = require 'node:fs'
PATH                      = require 'node:path'


#===========================================================================================================
{ version } = require '../package.json'
source_base = PATH.resolve __dirname, '../'
target_base = process.cwd()

#===========================================================================================================
cfg = do =>
  R =
    data:
      path:   PATH.resolve source_base, 'data'
    source:
      path:
        base:   source_base
        public: PATH.resolve source_base, 'public'
    target:
      path:
        base:   target_base
        public: PATH.resolve target_base, 'public'
    cp:
      errorOnExist:       true
      dereference:        true
      force:              false
      preserveTimestamps: true
      recursive:          true
  R.symlink_glob  = PATH.join R.source.path.public, '**'
  R.data.linklist = { path: ( PATH.resolve R.data.path, 'linklist.json' ), }
  return R

#===========================================================================================================
create = ->
  urge 'Ω___1', "helo from create-westcoast v#{version}"
  urge 'Ω___2', "cfg.source.path.base:    #{cfg.source.path.base}"
  urge 'Ω___3', "cfg.source.path.public:  #{cfg.source.path.public}"
  urge 'Ω___4', "cfg.target.path.base:    #{cfg.target.path.base}"
  try
    FS.cpSync cfg.source.path.public, cfg.target.path.public, cfg.cp
  catch error
    throw error unless error.code is 'ERR_FS_CP_EEXIST'
    warn 'Ω___5', em error.message
    process.exit 111
  return null


#===========================================================================================================
module.exports = { cfg, create, }

#===========================================================================================================
if module is require.main then do => create()



