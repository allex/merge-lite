###
# Extends destination object with source object(s) recursively.
#
# Assigns enumerable objects to the destination object. Source objects are applied
# from left to right.  support customizer which is invoked to produce the assigned
# values. If customizer returns undefined, assignment is handled by the method
# instead.
#
# MIT Licensed
# @author Allex Wang <allex.wxn@gmail.com> (http://iallex.com/)
###

UNDEFINED = undefined

{ hasOwnProperty, toString } = {}

isNil = (o, strict) ->
  o is UNDEFINED or (o is null and not strict)

isArray = Array.isArray || (arr) ->
  toString.call(arr) == '[object Array]'

isPlainObject = (obj) ->
  return false if not obj or toString.call(obj) isnt '[object Object]'

  hasOwnConstructor = hasOwnProperty.call(obj, 'constructor')
  ctor = obj.constructor
  hasIsPrototypeOf = ctor and ctor.prototype and hasOwnProperty.call(ctor.prototype, 'isPrototypeOf')

  # Not own constructor property must be Object
  return false if ctor and not hasOwnConstructor and not hasIsPrototypeOf

  # Own properties are enumerated firstly, so to speed up,
  # if last one is own, then all properties are own.
  for key of obj then

  isNil(key) or hasOwnProperty.call(obj, key)

extend = (args...) ->
  deep = false
  target = args[0]
  length = args.length
  last = args[length - 1]
  i = 1

  # Handle with a customizer
  if typeof last is 'function'
    customizer = last
    # skip the last
    length = length - 1

  # Handle a deep srcValue situation
  if typeof target is 'boolean'
    deep = target
    target = args[1] or {}
    # skip the boolean and the target
    i = 2

  target = {} if isNil(target) or typeof target not in [ 'object', 'function' ]

  while i < length
    # Only deal with non-null/undefined values
    if source = args[i++]

      # Extend the base object
      for key of source
        objValue = target[key]
        srcValue = source[key]

        # Prevent never-ending loop
        if target isnt srcValue

          # Recurse if we're merging plain objects or arrays
          if deep and srcValue and (isPlainObject(srcValue) or (isArr = isArray(srcValue)))
            if isArr
              isArr = false
              clone = if objValue and isArray(objValue) then objValue else []
            else
              clone = if objValue and isPlainObject(objValue) then objValue else {}

            newValue = if customizer then customizer(objValue, srcValue, key + '', target, source) else UNDEFINED

            # Never move original objects, clone them
            newValue = extend(deep, clone, srcValue, customizer) if isNil(newValue, true)

            target[key] = newValue

          # Don't bring in undefined values
          else if not isNil(srcValue, true)
            newValue = if customizer then customizer(objValue, srcValue, key + '', target, source)  else UNDEFINED
            newValue = srcValue if isNil(newValue, true)

            target[key] = newValue

  # Return the modified object
  target

module.exports = extend
