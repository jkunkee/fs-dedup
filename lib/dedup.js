/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var Emitter = require('events')
    ;

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
