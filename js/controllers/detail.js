app.controller('DetailCtrl', function($scope, $http, $state, $stateParams, $window, $modal, $log, API_URL) {
    console.log("Doctor ID: ",$stateParams._id);

    // Checking for permission
    if($window.sessionStorage.userId == $stateParams._id)
        $scope.editPermission = true;

    // Fetching data
    $http.post(API_URL + 'users/detail', {'_id': $stateParams._id}).
        success(function(data, status, headers, config) {
            console.log('Success',data);
            $scope.doctor = data[0];
        }).
        error(function(data, status, headers, config) {
            console.log('Error',data);
        });

    $scope.$watch(function(){
        console.log($window.sessionStorage.superuser);
        if($window.sessionStorage.superuser)
            return true;
        else
            return false;
    }, function(newVal){
        if(newVal){
            $scope.superuser = true;
        } else {
            $scope.superuser = false;
        }
    });

    // Constructing View

    // PlanDropdown
    $scope.planValue = 'No Change';
    $scope.changePlanValue = function(val) {
        $scope.planValue = val;
    }

    // Birthday Component
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
    $scope.format = 'dd-MMMM-yyyy';
    $scope.today = function() {
        $scope.doctor.birthday = new Date();
    };
    // $scope.today();

    //    $scope.disabled = function(date, mode) {
    //        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    //    };

    $scope.clear = function () {
        $scope.doctor.birthday = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    // Logic for updating the information
    $scope.updateData = function() {
        console.log("Updating user information");
        console.log("Current Plan", $scope.doctor.plan.current);
        console.log("Changed Plan", $scope.planValue);
        console.log("Doctor", $scope.doctor);

        if( $scope.planValue != 'No Change' && $scope.planValue != $scope.doctor.plan.current) {
            console.log("Current Plan", $scope.doctor.plan.current);
            console.log("Changed Plan", $scope.planValue);
            $scope.newPlanValue = $scope.planValue;
            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/planConfirmation.html',
                controller: 'PlanConfirmationCtrl',
                resolve: {
                    currentValue: function() {
                        return $scope.doctor.plan.current
                    },
                    newPlanValue: function() {
                        return $scope.planValue
                    }
                }
            });

            // Continue from here
            modalInstance.result.then(function () {
                $log.info('Updating Request');
                updateRequest();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {
            updateRequest();
        }
    }

    // Validations alert handling
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Uploading call
    updateRequest = function() {
        $http.post(API_URL + 'users/update', {'doctor': $scope.doctor, 'requestedPlan': $scope.planValue}).
            success(function(data, status, headers, config) {
                console.log('Success',data);
                $state.transitionTo('doctors-list', $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }).
            error(function(data, status, headers, config) {
                console.log('Error',data);
                $scope.alerts.push({type: 'danger', msg: data.message});
            });
    }
});