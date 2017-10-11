var assert = require('assert')
var merge = require('../')

describe('merge', () => {

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
        {
          foo: {
            bar: 'foo',
            list: [ 1, 2, 3 ]
          }
        },
        /* 4 */
        { /* empty */ },
        /* 5 */
        { /* empty */ },
        /* 6 */
        {
          ok: true,
          hello: {},
          word: []
        }
      ],
      list: [
        {name: 'a', value: '--1--' },
        {name: 'b', value: '--2--' },
        {name: 'c', value: '--3--' }
      ]
    }

    var objB = {
      f: [
        /* 0 */
        3,
        /* 1 */
        4,
        /* 2 */
        {
          foo: {
            bar: 'bar',
            list: [ 4, 5 ]
          }
        },
        /* 3 */
        {
          empty: 'fill'
        },
        /* 4 */
        [
          {name: 'a', value: '--a--' },
          {name: 'b', value: '--b--' },
          {name: 'c', value: '--c--' }
        ]
      ],
      list: [
        {name: 'a', value: '--a--' },
        {name: 'b', value: '--b--' },
        {name: 'd', value: '--d--' }
      ]
    }

    var ret = merge(objA, objB)
    assert.equal(ret.f[2].foo.bar, 'bar')
  })

  it('target object should be immutable', () => {
    var objA = { f: [ 1, 2, 3 ] }
    var objB = { f: [ 5, 6 ] }
    var ret = merge(objA, objB)
    assert.equal(objA.f[0], 1)
    assert.deepEqual(ret, { f: [ 5, 6, 3 ] })
  })

  it('merge by list by indexes', () => {
    var l1 = [
      { name: '0', value: '0' },
      { name: 'a', value: '1' },
      { name: 'b', value: '2' },
    ]
    var l2 = [
      { name: 'd', value: 'd', foo: 1 },
      { name: 'a', value: 'a', foo: 1 },
      { name: 'b', value: 'b' },
      { name: 'c', value: 'c', foo: 1 },
      { name: 'x', value: 'x', foo: 1 }
    ]

    var ret = merge(l1, l2, () => ({ pk: 'name', clone: true }))
    assert.deepEqual(ret[1], { name: 'a', value: 'a', foo: 1 })
  })
})
