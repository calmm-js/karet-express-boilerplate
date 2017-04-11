require("babel-core/register")({
  plugins: [ "transform-es2015-modules-commonjs" ]
})
require("babel-polyfill")

require("./main").default(process.env.PORT || 3000)
