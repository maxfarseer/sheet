'use strict';

angular.module('angleMineApp')
  .controller('sheetCtrl', function ($scope) {
    //config?
    $scope.th = ['id','parent_id','description','create_on','priority_id','tracker_id'];
    $scope.sheet = {};
    $scope.sheet.orderReverse = false;
    $scope.sheet.glyphArrow = true;

    $scope.sheetName = 'All issues';
    $scope.orderValue = 'id';

    $scope.orderReq = function(param) {
      //меняем порядок сортировки, если кликнули еще раз по этому же заголовку таблицы
      if ($scope.orderValue === param) {
        $scope.sheet.orderReverse = !$scope.sheet.orderReverse;
        return $scope.sheet.orderReverse;
      }
      $scope.orderValue = param;
      return $scope.orederValue;
    };

    $scope.rest.requirements.read({},function(data) {

      var requirements = _.filter(data.requirements, {tracker_id: 15});

      //$scope.tempReq = angular.copy(requirements);

      function buildTrees(requirements){
        _.each(requirements, function(requirement){
          requirement.totalChildren = requirement.descendants.length;
          if(requirement.descendants && requirement.descendants.length){
            buildTree(requirement.descendants, requirement.id);
          }
        });
      }

      function buildTree(descendants, parentId){
        _.each(descendants, function(descendant, index){
          descendant.descendants = [];
          descendants[index] = descendant;
        });
        _.each(descendants, function(descendant){
          if(descendant.parent_id !== parentId){
            _.find(descendants, {id: descendant.parent_id}).descendants.push(descendant);
            descendant.moved = true;
          }
        });
        _.remove(descendants, {moved: true});
      }

      buildTrees(requirements);

      //level for padding
      _.each(requirements, function(r) {
        checkChilds(r);
      });

      function checkChilds(o) {
        for (var i = 0; i < o.descendants.length; i++) {
          setLvl(o.descendants[i],1);
        }
      }

      function setLvl(o, lvl) {
        o.level = lvl;
        if (o.descendants.length) {
          for (var i = 0; i < o.descendants.length; i++) {
            setLvl(o.descendants[i],lvl+1);
          }
        } else {
          o.level = lvl;
        }
      }
      //end lvl for padding

      $scope.issues = requirements;

    });
  })
  .filter('sortParent', function() {
    return function(requirements,check) {
      var arr = [];

      function fillTreeReqsTasks(o) {
        arr.push(o);
        if (o.descendants.length) {
          for (var i = 0; i < o.descendants.length; i++) {
            fillTreeReqsTasks(o.descendants[i]);
          }
        }
      }

      function fillListTasks(o) {
        if (o.tracker_id !== 15) {
          arr.push(o);
        }
        for (var i = 0; i < o.descendants.length; i++) {
          fillListTasks(o.descendants[i]);
        }
      }

      function fillTreeReqs(o) {
        if (o.tracker_id === 15) {
          arr.push(o);
        }
        for (var i = 0; i < o.descendants.length; i++) {
          fillTreeReqs(o.descendants[i]);
        }
      }

      switch (check) {
        case 'tree-req-tasks':
          _.each(requirements, function(r) {
            if (!r.parent_id) {
              arr.push(r);
            }
            if (r.descendants.length > 0) {
              for (var i = 0; i < r.descendants.length; i++) {
                fillTreeReqsTasks(r.descendants[i]);
              }
            }
          });
          break;

        case 'list-tasks':
          _.each(requirements, function(r) {
            if (r.descendants.length > 0) {
              for (var i = 0; i < r.descendants.length; i++) {
                fillListTasks(r.descendants[i]);
              }
            }
          });
          break;

        case 'tree-req':
        //need refactor: copypaste from tree-req-tasks
          _.each(requirements, function(r) {
            if (!r.parent_id) {
              arr.push(r);
            }
            if (r.descendants.length > 0) {
              for (var i = 0; i < r.descendants.length; i++) {
                fillTreeReqs(r.descendants[i]);
              }
            }
          });
          break;
      }//switch case end

      return arr;

    };
  });
