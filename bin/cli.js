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
    , results
    ;

  function printError(filename) {
    console.log("error encountered:", filename);
  }
  function printProgress(filename) {
    console.log("starting to work on", filename);
  }
  function printResults(result) {
    console.log("got end:", result);
  }

  process.argv.slice(2, process.argv.length).forEach(function(path, idx) {
    if (/--.*/.test(path)) {
      flags.push(path);
    } else {
      sourceDirs.push(path);
    }
  });
  console.log("paths:", sourceDirs);
  console.log("flags:", flags);

  dedupEmitter = FsDedup.create({sources: sourceDirs});

  dedupEmitter.on('startFile', printProgress);
  dedupEmitter.on('end', printResults);
  dedupEmitter.on('error', printError);
  dedupEmitter.begin();
}());
