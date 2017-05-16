import babel       from "rollup-plugin-babel"
import builtins    from "rollup-plugin-node-builtins"
import commonjs    from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import replace     from "rollup-plugin-replace"
import uglify      from "rollup-plugin-uglify"

export default {
  plugins: [
    replace({
      "global.setTimeout": "window.setTimeout",
      "global.clearTimeout": "window.clearTimeout",
      "global.performance": "window.performance",
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    builtins(),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        "node_modules/react-dom/index.js": [
          "render",
        ],
        "node_modules/react/react.js": [
          "Component",
          "createElement"
        ],
        "node_modules/kefir/dist/kefir.js": [
          "Observable",
          "Stream",
          "Property",
          "combine",
          "concat",
          "constant",
          "constantError",
          "fromEvents",
          "interval",
          "later",
          "merge",
          "never",
          "stream"
        ]
      }
    }),
    babel(),
    process.env.NODE_ENV === "production" && uglify({
      compress: {
        passes: 3
      }
    })
  ].filter(x => x)
}
