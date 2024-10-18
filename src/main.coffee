

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

{ execa
  $
  ExecaError }            = require 'execa'
# { $: zx, cd: zx_cd }      = require 'zx'

debug 'Ω___1', $
debug 'Ω___2', await $"ls"
# debug 'Ω___3', rpr d for d from await $"ls"
info 'Ω___4', rpr d for await d from execa"ls"
try
  debug 'Ω___5', rpr d for await d from execa"ls nosuch"
catch error
  throw error unless error instanceof ExecaError
  warn 'Ω___6', error.cwd, ( rpr error.command ), ( em error.code ? '' )
  urge 'Ω___7', em error.originalMessage
  help 'Ω___8', em error.shortMessage
  warn 'Ω___9', em error.message

create = ->
  debug 'Ω__10', E.$
  debug 'Ω__11', E.execa
  debug 'Ω__12', await E.execa"ls"
  # execa = await import( 'execa' )
  # debug 'Ω__13', execa
  # try debug 'Ω__14', d for d from await E"ls" catch error then warn 'Ω__15', error.message
  # try debug 'Ω__16', d for d from await E.$"ls" catch error then warn 'Ω__17', error.message
  # try debug 'Ω__18', d for d from await E.execa"ls" catch error then warn 'Ω__19', error.message
  # try debug 'Ω__20', whatever = await E.execa"ls"
  # try debug 'Ω__21', ( d for d from whatever.stdout )
  return null
return null

# await create()

# module.exports = { create, }

# demo_zx = ->
#   count = 0
#   # for await line from execa"cat /usr/share/dict/ngerman"
#   zx_cd '/home/flow/jzr/bing-image-creator-downloader'
#   for await line from execa"python3.11 ./main.py"
#     count++; break if count > 10000
#     help 'Ω__22', rpr line
#   return null

# await demo_execa()

warn "Ω__23 stop"
return null

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
  info 'Ω__24', "#{source} -> #{target}"
  try
    FS.cpSync source, target, cfg.cp
  catch error
    throw error unless error.code is 'ERR_FS_CP_EEXIST'
    warn 'Ω__25', em error.message
    process.exit 111
  return null

#===========================================================================================================
create = ->
  urge 'Ω__26', "helo from create-westcoast v#{version}"
  urge 'Ω__27', "cfg.source.path.base:    #{cfg.source.path.base}"
  urge 'Ω__28', "cfg.source.path.public:  #{cfg.source.path.public}"
  urge 'Ω__29', "cfg.target.path.base:    #{cfg.target.path.base}"
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



