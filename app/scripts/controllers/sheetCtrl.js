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

      $scope.issues = requirements;
      console.log(requirements);

/*      _.each(requirements, function(o) {
        console.log(o.descendants); //children total 1 lvl
        if (o.descendants.length) {
          _.each(o.descendants, function(oChild) {
            //console.log(oChild); //children list lvl 2
            requirements.push(oChild);
          });
        }
      });*/

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
          console.log(descendant);
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

    });

  });
