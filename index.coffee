###*
# Merge for object array to support merged by a specficd property.
#
# @author Allex Wang (allex.wxn@gmail.com)
# MIT Licensed
###

'use strict'

extend = require 'extend'

# Assign all of [args](...Object) to the destination object [target]
# the api seems like [_.merge](https://lodash.com/docs/4.17.4#merge)
assignMerge = (target, args...) ->
  args.unshift true, target
  extend.apply null, args

TRUE = (k) -> true
OPTS = () -> {}

shadow = (o) -> if Array.isArray(o) then [] else {}

copy = (o) ->
  out = shadow o
  for k, v of o
    out[k] = if typeof v == 'object' then copy(v) else v
  out

baseMerge = (r, s, options = {}) ->

  # defaults to add new items in supplies
  options.add = options.add ? true

  return if s and not r then s

  if not Array.isArray(s)
    assignMerge(r, s)

  else if s and s.length
    id = options.pk ? 'id'
    filter = options.filter or TRUE

    # cache the duplicates items
    pending = []

    refMap = {}
    for m in r
      k = m[id]
      if k
        if refMap[k]
          pending.push m
        else
          refMap[k] = m

    sMap = {}

    # Iterate source list to merge element by primary key
    for m in s
      if m and (k = m[id]) and filter(m)
        sMap[k] = m
        if refMap[k]
          assignMerge refMap[k], m
        else if options.add
          r.push m

    # process pending items duplicated.
    if pending.length > 0
      for o in pending
        m = sMap[o[id]]
        assignMerge o, m if m and filter(m)

  # Returns the target [r]
  r

merge = (args...) ->
  options = OPTS
  target = shadow args[0]
  if typeof args[args.length - 1] is 'function'
    options = args[args.length - 1]
    args.pop()
  options = options()
  for source in args
    baseMerge target, source, options
  return target

module.exports = merge
