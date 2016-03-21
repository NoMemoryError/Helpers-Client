app.controller('PlanConfirmationCtrl', function($scope, $modalInstance, newPlanValue, currentValue) {
    $scope.newPlanValue = newPlanValue;
    $scope.currentValue = currentValue;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});