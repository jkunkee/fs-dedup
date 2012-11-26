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
      function useStat(err, stats) {
        if (err) {
          emitter.emit('error', pathname, err);
        } else if (stats.isDirectory()) {
          fs.readdir(pathname, processDirList);
        } else if (stats.isFile()) {
          emitter.emit('file', pathname);
        } else {
          emitter.emit('special', pathname);
        }
      }
      fs.lstat(path.resolve(pathname), useStat);
    }
  
    emitter.on('new', handleNode);
    return emitter;
  }
  function test() {
    var walker = createRecurser();
    function printError() {console.log('error', arguments);}
    function printFile() {console.log('file', arguments);}
    function printSpecial() {console.log('special', arguments);}
    function printNew() {console.log('new', arguments);}
    walker.on('error', printError);
    walker.on('file', printFile);
    walker.on('special', printSpecial);
    //walker.on('new', printNew);
    walker.emit('new', path.join(__dirname, '..', 'testdir'));
  }

  if (require.main !== exports) {
    //test();
  }
  module.exports.create = createRecurser;
}());
