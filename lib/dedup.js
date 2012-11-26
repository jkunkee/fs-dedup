/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var Emitter = require('events').EventEmitter
    //, wrench = require('wrench')
    , forEachAsync = require('forEachAsync')
    , TreeWalker = require('./fileTreeWalker')
    ;

  var crypto = require('crypto')
    , fs = require('fs')
    ;
  function digestFile(filename, cb) {
    var shasum = crypto.createHash('sha1')
      , mdsum = crypto.createHash('md5')
      , fileReader = fs.ReadStream(filename)
      ;
    function aggregateSumData(datum) {
      shasum.update(datum);
      mdsum.update(datum);
    }
    function reportHash() {
      cb({mdhash: mdsum.digest('hex'), shasum: shasum.digest('hex')});
    }
    fileReader.on('data', aggregateSumData);
    fileReader.on('end', reportHash);
  }

  function createDeduper(options) {
    var interfaceEmitter = new Emitter()
      , walker = TreeWalker.create()
      ;
    function beginProcessing() {
      var results = {}
        ;
      function getSum(filename) {
        interfaceEmitter.emit('startFile', path);
        function emitSum(sums) {
          interfaceEmitter.emit('endFile', sums);
/* TODO: add as child if already present */
          results[path] = sums;
console.log(results);
          nextFile();
        }
        digestFile(filename, emitSum);
      }
      walker.removeAllListeners();
      walker.on('file', getSum);
      walker.on('error', function(){console.log(arguments)});
      options.sources.forEach(function(sourceDir) {
        interfaceEmitter.emit('startFile', sourceDir);
        walker.emit('new', sourceDir);
      });
// TODO: end gracefully
      //interfaceEmitter.emit('end', results);
    }
    interfaceEmitter.begin = beginProcessing;
    return interfaceEmitter;
  }

  module.exports = {
      create: createDeduper
  };
}());
