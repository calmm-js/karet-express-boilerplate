require('babel-core/register')({
  plugins: ['transform-es2015-modules-commonjs']
})
require('babel-polyfill')
require('../../generated/babel-external-helpers')
