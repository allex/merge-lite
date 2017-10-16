###*
# Merge for object array to support merged by a specficd property.
#
# @author Allex Wang (allex.wxn@gmail.com)
# MIT Licensed
###

extend = require './lib/extend'

{ toString } = {}

isArray = Array.isArray or (arr) ->
	toString.call(arr) is '[object Array]'

# Assign all of [args](...Object) to the destination object [target]
# the api seems like [_.merge](https://lodash.com/docs/4.17.4#merge)
assignMerge = (target, source, customizer) ->
  extend true, target, source, customizer

TRUE = (k) -> true
OPTS = () -> (null)

shadow = (o) ->
  if isArray(o) then [] else {}

copy = (o) ->
  out = shadow o
  for k, v of o
    out[k] = if typeof v == 'object' then copy(v) else v
  out

baseMerge = (r, s, options, customizer) ->

  # defaults to add new items in supplies
  options.add = options.add ? true

  return if s and not r then s

  if not isArray(s)
    assignMerge(r, s, customizer)

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
          assignMerge refMap[k], m, customizer
        else if options.add
          r.push m

    # process pending items duplicated.
    if pending.length > 0
      for o in pending
        m = sMap[o[id]]
        assignMerge o, m, customizer if m and filter(m)

  # Returns the target [r]
  r

merge = (sources...) ->
  options = OPTS
  i = 1
  length = sources.length
  target = sources[0]
  target = Object() if not target or typeof target not in ['object', 'function']

  for x in [1..2]
    break if typeof sources[length - 1] isnt 'function'
    fn = sources[--length]
    if fn.length
      customizer = fn
    else
      options = fn

  options = options()
  throw new Error('Illegal option generator.') if options is undefined

  options = options || {}

  # freeze destination object optionally
  if options.freeze
    i = 0
    target = shadow(target)

  # iteration
  baseMerge target, sources[i++], options, customizer while i < length

  return target

module.exports = merge
