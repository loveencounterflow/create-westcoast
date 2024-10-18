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
  urge 'Ω___1', "write list of symlinks"
  R = []
  for target in glob.sync cfg.symlink_glob
    continue unless ( FS.lstatSync target ).isSymbolicLink()
    source = FS.realpathSync target
    source = PATH.relative cfg.source.path.base, source
    target = PATH.relative cfg.source.path.base, target
    info 'Ω___2', "#{source} -> #{target}"
    R.push { source, target, }
  FS.writeFileSync cfg.data.linklist.path, JSON.stringify R, null, '  '
  urge 'Ω___3', "symlinks written to #{cfg.data.linklist.path}"
  return null


#===========================================================================================================
module.exports = { write_symlink_list, }

#===========================================================================================================
if module is require.main then do => write_symlink_list()
