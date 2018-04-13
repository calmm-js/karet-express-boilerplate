import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

export default {
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-dom/index.js': ['hydrate', 'render'],
        'node_modules/react/index.js': [
          'Component',
          'Fragment',
          'createElement'
        ],
        'node_modules/kefir/dist/kefir.js': [
          'Observable',
          'Stream',
          'Property',
          'combine',
          'concat',
          'constant',
          'constantError',
          'fromEvents',
          'interval',
          'later',
          'merge',
          'never',
          'stream'
        ]
      }
    }),
    babel(),
    nodeGlobals(),
    nodeBuiltins(),
    process.env.NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3
        }
      })
  ].filter(x => x)
}
