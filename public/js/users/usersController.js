/**
 * Created by alex on 25.11.15.
 */
angular.module('TaskManager')
    .factory('User', function ($resource) {
        return $resource('/api/users/:userId', {userId: '@_id'}, {update: {method: 'PUT'}})
    })
    .controller('UsersController', function ($scope, $state, User) {
        $scope.form = {}

        $scope.register = function () {

        }
    });
