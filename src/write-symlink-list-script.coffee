#!/usr/bin/env node


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
  whisper }               = GUY.trm.get_loggers 'create-westcoast/prepare'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
#...........................................................................................................
FS                        = require 'node:fs'
PATH                      = require 'node:path'
glob                      = require 'glob'
{ cfg }                   = require '..'


#===========================================================================================================
# FS.symlinkSync


#===========================================================================================================
write_symlink_list = ->
  # help 'Ω___1', __filename
  # help 'Ω___2', cfg
  # help 'Ω___3', cfg.source.path.public
  # help 'Ω___4', glob.sync
  R = []
  for target in glob.sync cfg.symlink_glob
    continue unless ( FS.lstatSync target ).isSymbolicLink()
    source = FS.realpathSync target
    source = PATH.relative cfg.source.path.base, source
    target = PATH.relative cfg.source.path.base, target
    info 'Ω___5', "#{source} -> #{target}"
    R.push { source, target, }
  # help 'Ω___6', cfg.data.path
  # help 'Ω___7', cfg.data.linklist.path
  FS.writeFileSync cfg.data.linklist.path, JSON.stringify R, null, '  '
  return null


#===========================================================================================================
module.exports = { write_symlink_list, }

#===========================================================================================================
if module is require.main then do => write_symlink_list()
