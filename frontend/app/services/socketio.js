(function () {
  'use strict';

  angular.module('socket')
    .factory('socket', ["$rootScope", function ($rootScope) {
      var socket = io.connect("ws://127.0.0.1:3000");

      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
    }]);
}());
