app.controller('ListCtrl', function($scope, $http, $window, $state, $stateParams, API_URL) {
    if($window.sessionStorage.token){
        $http.post(API_URL + 'users/list').
            success(function(data, status, headers, config) {
                console.log(data,status);
                $scope.doctors = data;
            }).
            error(function(data, status, headers, config) {
            });
    } else {
        $http.post(API_URL + 'users/list').
            success(function(data, status, headers, config) {
                console.log(data,status);
                $scope.doctors = data;
            }).
            error(function(data, status, headers, config) {
            });
    }

    $scope.redirectDetailView = function() {
        $stateParams._id = $window.sessionStorage.userId;
        $state.transitionTo('doctor-detail', $stateParams);
    }

    $scope.login = function() {
        console.log("Login process starts");
        console.log("Email",document.getElementById('inputEmail1').value);
        console.log("Password",document.getElementById('inputPassword1').value);

        var username = document.getElementById('inputEmail1').value;
        var password = document.getElementById('inputPassword1').value;


        $http.post(API_URL + 'users/login', {'username': username, 'password': password}).
            success(function(data, status, headers, config) {
                console.log(data);
                console.log('Token',data.token);
                console.log('SuperUser',data.superuser);

                if(data.token){
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.name = data.firstName + " " + data.lastName;
                    $window.sessionStorage.token = data.token;
                    if(data.superuser) {
                        $window.sessionStorage.superuser = data.superuser;
                    } else {
                        if(data.id)
                            $window.sessionStorage.userId = data.id;
                        $stateParams._id = data.id;
                        $state.transitionTo('doctor-detail', $stateParams);
                    }
                }
                else{
                    $scope.loginMessage = data.message;
                }
            }).
            error(function(data, status, headers, config) {
                // Erase the token if the user fails to log in
                deleteSessionData();
                console.log(data, status);
                $scope.loginMessage = data.message;
            });
    }

    $scope.logout = function() {
        console.log($window.sessionStorage);
        deleteSessionData();
//        $state.transitionTo($state.current, $stateParams, {
//            reload: true,
//            inherit: false,
//            notify: true
//        });
    }

    $scope.signup = function() {
        console.log("Login process starts");
        //TODO Validations Checking
        console.log("First Name: ",$scope.user.fnameSignup);
        console.log("Last Name: ",$scope.user.lnameSignup);
        console.log("Email: ",$scope.user.emailSignup);
        console.log("Password: ",$scope.user.passwordSignup);
        console.log("Confirm Password: ",$scope.user.cpasswordSignup);

        $http.post(API_URL + 'users/signup', {'username': $scope.user.emailSignup, 'password': $scope.user.passwordSignup,
            'firstName': $scope.user.fnameSignup, 'lastName': $scope.user.lnameSignup}).
            success(function(data, status, headers, config) {
                console.log(data, status);
                $scope.signupMessage = "Sign Up successful. Please verify your email address";
            }).
            error(function(data, status, headers, config) {
                console.log(data, status)
                $scope.signupMessage = "This email is already registered";
            });
    }

    $scope.search = function() {
        console.log("Search Initiated");
        console.log("Advance Search", $scope.advanceSearch);
        console.log("Zipcode", $scope.zipcode);

        var advanceSearch = $scope.advanceSearch;
        var criteria = {
            advanceSearch: -1,
            zipCode: -1
        }

        if(advanceSearch && advanceSearch.trim()) {
            criteria.advanceSearch = advanceSearch;
        }
        if($scope.zipcode) {
            criteria.zipCode = $scope.zipcode;
        }

        $http.post(API_URL + 'users/search', {'criteria': criteria}).
            success(function(data, status, headers, config) {
                console.log(data, status);
                $scope.doctors = data.result;
            }).
            error(function(data, status, headers, config) {
                console.log(data, status)
            });
    }

    $scope.clearSearch = function() {
        console.log("Advance Search", $scope.advanceSearch);
        console.log("Zipcode", $scope.zipcode);

        $scope.advanceSearch = '';
        $scope.zipcode = '';
        var criteria = {
            advanceSearch: -1,
            zipCode: -1
        }

        $http.post(API_URL + 'users/search', {'criteria': criteria}).
            success(function(data, status, headers, config) {
                console.log(data, status);
                $scope.doctors = data.result;
            }).
            error(function(data, status, headers, config) {
                console.log(data, status)
            });
    }

    $scope.approve = function(username) {
        console.log(username);
        $http.post(API_URL + 'users/approve', {'username': username}).
            success(function(data, status, headers, config) {
                console.log(data, status);
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });

            }).
            error(function(data, status, headers, config) {
                console.log(data, status)
            });
    }

    $scope.delete = function(username) {
        console.log(username);
    }

    $scope.$watch(function(){
        console.log($window.sessionStorage.token);
        console.log($window.sessionStorage.name);
        if($window.sessionStorage.token)
            return true;
        else
            return false;
    }, function(newVal){
        if(newVal){
            $scope.loginStatus = true;
            $scope.name = $window.sessionStorage.name;
        } else {
            $scope.loginStatus = false;
        }
    })

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
    })

    deleteSessionData = function() {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.superuser;
        delete $window.sessionStorage.userId;
    }

    $scope.openSignUpModel = function() {
        $scope.signupMessage = '';
        $scope.user = {};
        $scope.user.fnameSignup = '';
        $scope.user.lnameSignup = '';
        $scope.user.emailSignup = '';
        $scope.user.passwordSignup = '';
        $scope.user.cpasswordSignup = '';
    };

    $scope.openSignInModel = function() {
        $scope.loginMessage = '';
    }
});