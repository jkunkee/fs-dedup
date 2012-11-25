/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var Emitter = require('events').EventEmitter
    , fs = require('fs')
    , path = require('path')
    ;

  function createRecurser() {
    var emitter = new Emitter()
      ;

    function handleNode(pathname) {
      function processDirList(err, dirList) {
        if (err) {
          console.error(pathname, "is not a directory");
          emitter.emit('error', pathname);
          return;
        }
        dirList.forEach(function(dirElem) {
          emitter.emit('new', path.join(pathname, dirElem));
        });
      }
      fs.lstat(pathname, function (err, stats) {
        if (err) {
          emitter.emit('error', pathname, err);
        } else if (stats.isDirectory()) {
          fs.readdir(pathname, processDirList);
        } else {
          emitter.emit('file', pathname);
        }
      });
    }
  
    emitter.on('new', handleNode);
    return emitter;
  }

  module.exports.create = createRecurser;
}());
