'use strict';

angular.module('angleMineApp')
  .factory('rest', ['$resource', function ($resource) {

    //var root = 'http://localhost:3000/projects/6/issues/';
    var root = '/';
    var rest = {

      //requirements: $resource(root+'projects/:project/issues/requirements.json', {}, {
      requirements: $resource(root+'data/requirements.json', {}, {
        read: {
          method: 'get',
          cache: true
        }
      })

    };
    return rest;
  }]);
