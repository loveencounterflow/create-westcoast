

'use strict'

#===========================================================================================================
GUY                       = require 'guy'
{ debug }                 = GUY.trm.get_loggers 'create-westcoast/types'
#...........................................................................................................
{ Intertype }             = require 'intertype'
types                     = null

#===========================================================================================================
@get_types = ->
  unless types?
    types = new Intertype()
    #.......................................................................................................
    unless Reflect.has types.declarations, 'class'
      types.declare class: ( x ) ->
        return ( ( Object::toString.call x ) is '[object Function]' ) and \
          ( Object.getOwnPropertyDescriptor x, 'prototype' )?.writable is false
  #.........................................................................................................
  return types

  