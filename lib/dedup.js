/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var Emitter = require('events').EventEmitter
    , wrench = require('wrench')
    , forEachAsync = require('forEachAsync')
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
      ;
    function beginProcessing() {
      var results = {};
      forEachAsync(options.sources, function(nextSourceDir, path) {
        function getSum(nextFile, filename) {
          interfaceEmitter.emit('startFile', path);
          function emitSum(sums) {
            interfaceEmitter.emit('endFile', sums);
            results[path] = sums;
            nextFile();
          }
          digestFile(filename, emitSum);
        }
        forEachAsync(wrench.readdirSyncRecursive(path), getSum).next(nextSourceDir);
      }).then(function() {
        interfaceEmitter.emit('end', results);
      });
    }
    interfaceEmitter.begin = beginProcessing;
    return interfaceEmitter;
  }

  module.exports = {
      create: createDeduper
  };
}());
