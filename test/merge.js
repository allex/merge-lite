var assert = require('assert')
var merge = require('../')

describe('test merge(args...)', () => {

  it('shadow merge', () => {
    var ret = merge({ a: 1, b: 2, c: 3 }, { b: 'b' }, { c: '3' })
    assert.deepEqual(ret, { a: 1, b: 'b', c: '3' })
  })

  it('nested array', () => {
    var ret = merge({ f: [ 1, 2, 3 ] }, { f: [ 5, 6 ] })
    assert.deepEqual(ret, { f: [ 5, 6, 3 ] })
  })

  it('normal object merge', () => {
    var objA = {
      c: 'C10k',
      f: [
        /* 0 */
        1,
        /* 1 */
        2,
        /* 3 */
        { foo: { bar: 'foo', list: [ 1, 2, 3 ] } },
        /* 4 */
        { /* empty */ },
        /* 5 */
        { /* empty */ },
        /* 6 */
        { ok: true, hello: {}, word: [] }
      ]
    }
    var objB = {
      f: [
        /* 0 */
        3,
        /* 1 */
        4,
        /* 2 */
        { foo: { bar: 'bar', list: [ 4, 5 ] } },
        /* 3 */
        { empty: 'fill' },
        /* 4 */
        [ {name: 'a' } ]
      ]
    }
    var ret = merge(objA, objB)
    assert.equal(ret.f[2].foo.bar, 'bar')
  })

  it('freeze target with options: () => ({ freeze: true })', () => {
    var objA = { f: [ 1, 2, 3 ] }
    var objB = { f: [ 5, 6 ] }
    var ret = merge(objA, objB, () => ({ freeze: true }))
    assert.deepEqual(objA, { f: [ 1, 2, 3 ] })
    assert.deepEqual(ret, { f: [ 5, 6, 3 ] })
  })

  it('merge by a specific customizer', () => {
    var objA = { f: [ 1, 2, 3 ], bar: { b: 1, v: false } }
    var objB = { f: [ 5, 6 ], bar: { b: 'b', a: 'new' } }
    var ret = merge(objA, objB, (objValue, srcValue, key, targe, source) => {
      if (Array.isArray(srcValue)) {
        return objValue.concat(srcValue)
      }
    })
    assert.deepEqual(
      ret,
      {
        f: [1, 2, 3, 5, 6],
        bar: { b: 'b', a: 'new', v: false }
      }
    )
  })

  it('merge by list by indexes', () => {
    var l1 = [
      { name: '0', value: '0' },
      { name: 'a', value: '1' },
      { name: 'b', value: '2' },
    ]
    var l2 = [
      { name: 'd', value: 'd', foo: 1 },
      { name: 'a', foo: 1 },
      { name: 'b', value: 'b' },
      { name: 'c', value: 'c', foo: 1 },
      { name: 'x', value: 'x', foo: 1 }
    ]

    var ret = merge([], l1, l2, () => ({ pk: 'name' }))
    assert.deepEqual(ret[1], { name: 'a', value: '1', foo: 1 })
  })

})
