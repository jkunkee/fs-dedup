#!/usr/local/bin/node
/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";
  
  var path = require('path')
    , FsDedup = require(path.join(__dirname, '..', 'lib', 'dedup.js'))
    , dedupEmitter
    , flags = []
    , sourceDirs = []
    , destDir
    ;

  dedupEmitter = FsDedup.create();

  process.argv.slice(2, process.argv.length).forEach(function(path, idx) {
    if (/--.*/.test(path)) {
      flags.push(path);
    } else {
      sourceDirs.push(path);
    }
  });
  console.log("paths:", sourceDirs);
  console.log("flags:", flags);
}());
