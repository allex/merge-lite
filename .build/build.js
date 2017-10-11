/**
 * rollup.config.js
 *
 * MIT Licensed
 *
 * Authors:
 *   Allex Wang <allex.wxn@gmail.com> (http://iallex.com/)
 */

'use strict'

var fs = require('fs')
var path = require('path')
var rollup = require('rollup')
var uglify = require('uglify-js')
var commonjs = require('rollup-plugin-commonjs')
var node = require('rollup-plugin-node-resolve')
var pkg = require('../package.json')
var coffee = require('rollup-plugin-coffee-script')

function rollupConfig (entry) {
  return {
    input: {
      input: entry.entry,
      plugins: [
        coffee(),
        node({
          jsnext: true,
          browser: true,
          module: true,
          extensions: ['.js', '.coffee']
        }),
        commonjs({
          extensions: ['.js', '.coffee']
        })
      ]
    },
    targets: entry.targets.map(v => v)
  }
}

function read (path) {
  return fs.readFileSync(path, 'utf8')
}

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

const tasks = [
  {
    entry: 'index.coffee',
    targets: [
      {
        format: 'umd',
        name: 'Merge',
        file: 'dist/merge.umd.js'
      },
      {
        format: 'cjs',
        file: 'dist/index.js'
      }
    ]
  }
]

Promise.all(tasks.map(async (task) => {

  const { input, targets } = rollupConfig(task)

  // create a bundle
  let bundle = await rollup.rollup(input)

  return Promise.all(targets.map(async (output) => {

    // generate code and a sourcemap
    const { code, map } = await bundle.generate(output)
    const { file: dest, minimize } = output

    if (!minimize) {
      // pipe bundle result to dest file
      await write(dest, code, bundle)
    }

    if (minimize || !['es', 'cjs'].includes(output.format)) {
      // generate a *.min.js
      let minify = uglify.minify(code, {
        output: {
          comments: function (n, c) {
            /*
            IMPORTANT: Please preserve 3rd-party library license info,
            inspired from @allex/amd-build-worker/config/util.js
            */
            var text = c.value, type = c.type;
            if (type == 'comment2') {
              return /^!|@preserve|@license|@cc_on|MIT/i.test(text)
            }
          }
        }
      })
      await write(path.join(path.dirname(dest), `${path.basename(dest, '.js')}.min.js`), minify.code, bundle)
    }

    return bundle
  }))

})).catch(logError)
