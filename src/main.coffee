

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

#===========================================================================================================
{ version } = require '../package.json'
urge 'Ω___1', "helo from create-westcoast v#{version}"
urge 'Ω___2', "CWD is #{process.cwd()}"


