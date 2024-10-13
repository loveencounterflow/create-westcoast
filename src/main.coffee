

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
copy = ( source, target ) ->
  info 'Ω___1', "#{source} -> #{target}"
  try
    FS.cpSync source, target, cfg.cp
  catch error
    throw error unless error.code is 'ERR_FS_CP_EEXIST'
    warn 'Ω___2', em error.message
    # process.exit 111
  return null

#===========================================================================================================
create = ->
  urge 'Ω___3', "helo from create-westcoast v#{version}"
  urge 'Ω___4', "cfg.source.path.base:    #{cfg.source.path.base}"
  urge 'Ω___5', "cfg.source.path.public:  #{cfg.source.path.public}"
  urge 'Ω___6', "cfg.target.path.base:    #{cfg.target.path.base}"
  #.........................................................................................................
  copy cfg.source.path.public, cfg.target.path.public
  #.........................................................................................................
  for { source, target, } in require cfg.data.linklist.path
    source = PATH.resolve cfg.source.path.base, source
    target = PATH.resolve cfg.target.path.base, target
    copy source, target
  #.........................................................................................................
  return null


#===========================================================================================================
module.exports = { cfg, create, }

#===========================================================================================================
if module is require.main then do => create()



