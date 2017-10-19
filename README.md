# merge-lite

A tiny implementation of merge that api compatible with lodash [`_.mergeWith()`][1]

```js
import merge from 'merge-lite'
merge( object, ...sources, [ customizer ] )
```

## Installation

```sh
npm i merge-lite
```

## Features

- `_.mergeWith()` api, see [docs][1].
- Support merge a array `Array<Object>` in the top level by specific property.

## Example

```js
it('shadow merge', () => {
  var ret = merge(
    { a: 1, b: 2, c: 3 },
    { b: 'b' }, { c: '3' }
  )
  assert.deepEqual(ret,
    { a: 1, b: 'b', c: '3' }
  )
})

it('nested array', () => {
  var ret = merge(
    { f: [ 1, 2, 3 ] },
    { f: [ 5, 6 ] }
  )
  assert.deepEqual(ret,
    { f: [ 5, 6, 3 ] }
  )
})

it('merge by list by indexes', () => {
  var l1 = [
    { name: '0', value: '0' },
    { name: 'a', value: '1' },  // <---
    { name: 'b', value: '2' },
  ]
  var l2 = [
    { name: 'd', value: 'd', foo: 1 },
    { name: 'a', foo: 1 },  // <---
    { name: 'b', value: 'b' },
    { name: 'c', value: 'c', foo: 1 },
    { name: 'x', value: 'x', foo: 1 }
  ]

  /*
  [ { name: '0', value: '0' },
    { name: 'a', value: '1', foo: 1 }, // <<<=-
    { name: 'b', value: 'b' },
    { name: 'd', value: 'd', foo: 1 },
    { name: 'c', value: 'c', foo: 1 },
    { name: 'x', value: 'x', foo: 1 } ]
  */

  var ret = merge(l1, l2, () => ({ pk: 'name' }))
  assert.deepEqual(ret[1],
    { name: 'a', value: 'a', foo: 1 }
  )
})

it('merge by a specific customizer', () => {
  var objA =
  {
    f: [ 1, 2, 3 ],
    bar: { b: 1, v: false }
  }
  var objB =
  {
    f: [ 5, 6 ],
    bar: { b: 'b', a: 'new' }
  }
  var ret = merge(objA, objB, (objValue, srcValue, key, targe, source) => {
    if (Array.isArray(srcValue)) {
      return objValue.concat(srcValue)
    }
  })
  assert.deepEqual(
    ret,
    {
      f: [1, 2, 3, 5, 6], // <--- concat by customizer
      bar: { b: 'b', a: 'new', v: false }
    }
  )
})
```

## License

[MIT](http://opensource.org/licenses/MIT)

[1]: https://lodash.com/docs/#mergeWith
