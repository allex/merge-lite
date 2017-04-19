###*
# Merge for object array to support merged by a specficd property indexes.
#
# @author Allex Wang (allex.wxn@gmail.com)
# MIT Licensed
###

'use strict'

baseMerge = require('lodash').merge

TRUE = (k) -> true

copy = (o) ->
  out = if Array.isArray(o) then [] else {}
  for k, v of o
    out[k] = if typeof v == 'object' then copy(v) else v
  out

merge = (r, s, options = {}) ->
  # defaults to add new items in supplies
  options.add = options.add ? true

  return s and copy(s) or s if not r

  if not Array.isArray(s)
    r = baseMerge(r, s)

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
    for m in s
      if m and (k = m[id]) and filter(m)
        sMap[k] = m
        if refMap[k]
          baseMerge refMap[k], m
        else if options.add
          r.push m

    # process pending items duplicated.
    if pending.length > 0
      for o in pending
        m = sMap[o[id]]
        baseMerge o, m if m and filter(m)

  # return a copy if needed.
  if options.clone then copy(r) else r

module.exports = merge
