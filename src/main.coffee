

'use strict'

#===========================================================================================================
GUY                       = require 'guy'
{ rpr
  inspect
  echo
  reverse }               = GUY.trm
#...........................................................................................................
FS                        = require 'node:fs'
PATH                      = require 'node:path'
{ execa
  $
  ExecaError }            = require 'execa'
CLK                       = require '@clack/prompts'
{ get_types }             = require './types'
#...........................................................................................................
log       = ( P... ) -> echo ( GUY.trm.grey '│ ' ), ( GUY.trm.lime P... )
warn      = ( P... ) -> echo ( GUY.trm.grey '│ ' ), ( GUY.trm.red  P... )
help      = ( P... ) -> echo ( GUY.trm.grey '│ ' ), ( GUY.trm.gold P... )
ask       = ( P... ) -> GUY.trm.gold P...



#===========================================================================================================
class Stepper

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    GUY.props.hide @, '_types', get_types()
    GUY.props.hide @, '_transforms', []
    return undefined

  #---------------------------------------------------------------------------------------------------------
  # [Symbol.iterator]: -> yield from @_transforms

  #---------------------------------------------------------------------------------------------------------
  _run: ->
    chain = ( GUY.props.get_prototype_chain @ ).reverse()
    for object in chain
      for key from GUY.props.walk_keys object, { hidden: true, builtins: false, depth: 0, }
        continue if key is 'constructor'
        continue if key is 'length'
        continue if key.startsWith '_'
        for method from @_walk_values object[ key ]
          continue unless ( @_types.isa.function method ) or ( @_types.isa.asyncfunction method )
          echo 'Ω___1', GUY.trm.reverse key
          await method.call @
    return null

  #---------------------------------------------------------------------------------------------------------
  _walk_values: ( value ) ->
    return yield new value() if @_types.isa.class value
    #.......................................................................................................
    if @_types.isa.function value
      return yield value unless ( value.name.startsWith '$' ) or ( value.name.startsWith 'bound $' )
      return yield value.call @
    #.......................................................................................................
    if @_types.isa.list value
      for e in value
        yield d for d from @_walk_values e
      return null
    #.......................................................................................................
    return yield value


#===========================================================================================================
class Create extends Stepper

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    ### TAINT use types ###
    @cfg = {}
    return undefined

  #---------------------------------------------------------------------------------------------------------
  intro: ->
    CLK.intro "create-westcoast"
    @cfg.initial_cwd = process.cwd()
    return null

  #---------------------------------------------------------------------------------------------------------
  create_app_folder: ->
    cfg =
      message:      ask "In which folder should the WestCoast app be created?"
      placeholder:  "folder name"
      initialValue: "my-westcoast-app"
      validate:     ( value ) ->
        # debug 'Ω___2', rpr value
        return "Value is required!" if value.length is 0
        return null
    loop
      @cfg.app_base_path = PATH.resolve process.cwd(), await CLK.text cfg
      echo 'Ω___3', "filetype:", FS.get_descriptor @cfg.app_base_path
      dsc = FS.get_descriptor @cfg.app_base_path
      #.....................................................................................................
      if dsc.is_loop
        warn @cfg.app_base_path
        warn "is a looped symlink leading to nowhere; refusing to overwrite"
        help "please choose another name"
        continue
      #.....................................................................................................
      switch dsc.type
        when null
          help "creating folder #{@cfg.app_base_path}"
          FS.mkdirSync @cfg.app_base_path
          break
        when 'link'
          warn @cfg.app_base_path
          warn "is a dangling symlink; refusing to overwrite"
          help "please choose another name"
          continue
        when 'folder'
          ### TAINT distinguish between empty and non-empty folder ###
          warn @cfg.app_base_path
          warn "is an existing folder"
          break if await CLK.confirm { message: ask "do you want to create the app in the existing folder?", }
          continue
        when 'file'
          warn @cfg.app_base_path
          warn "is an existing file"
          help "please choose another name"
          continue
        else
          warn @cfg.app_base_path
          warn "is an existing #{dsc.type} device;"
          help "please choose another name"
          continue
    log "app will be created in #{@cfg.app_base_path}"
    return null

  #---------------------------------------------------------------------------------------------------------
  cd_to_app_base_path: ->
    process.chdir @cfg.app_base_path
    return null

  #---------------------------------------------------------------------------------------------------------
  outro: ->
    process.chdir @cfg.initial_cwd ### not strictly needed ###
    CLK.outro "create-westcoast"
    return null


await ( new Create() )._run()

create = ->
  debug 'Ω___4', $
  debug 'Ω___5', await $"ls"
  # debug 'Ω___6', rpr d for d from await $"ls"
  info 'Ω___7', rpr d for await d from execa"ls"
  try
    debug 'Ω___8', rpr d for await d from execa"ls nosuch"
  catch error
    throw error unless error instanceof ExecaError
    warn 'Ω___9', error.cwd, ( rpr error.command ), ( em error.code ? '' )
    urge 'Ω__10', em error.originalMessage
    help 'Ω__11', em error.shortMessage
    warn 'Ω__12', em error.message
  return null

module.exports = { create, }

# demo_zx = ->
#   count = 0
#   # for await line from execa"cat /usr/share/dict/ngerman"
#   zx_cd '/home/flow/jzr/bing-image-creator-downloader'
#   for await line from execa"python3.11 ./main.py"
#     count++; break if count > 10000
#     help 'Ω__13', rpr line
#   return null

# await demo_execa()

warn "Ω__14 stop"
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
  info 'Ω__15', "#{source} -> #{target}"
  try
    FS.cpSync source, target, cfg.cp
  catch error
    throw error unless error.code is 'ERR_FS_CP_EEXIST'
    warn 'Ω__16', em error.message
    process.exit 111
  return null

#===========================================================================================================
create = ->
  urge 'Ω__17', "helo from create-westcoast v#{version}"
  urge 'Ω__18', "cfg.source.path.base:    #{cfg.source.path.base}"
  urge 'Ω__19', "cfg.source.path.public:  #{cfg.source.path.public}"
  urge 'Ω__20', "cfg.target.path.base:    #{cfg.target.path.base}"
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



