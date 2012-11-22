/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var Emitter = require('events')
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
    var core = {}
      , interfaceEmitter = new Emitter()
      , processEmitter = new Emitter()
      ;
    function beginProcessing() {
    }
    core.begin = beginProcessing;
    return core;
  }

  module.exports = {
      create: createDeduper
  };
}());
