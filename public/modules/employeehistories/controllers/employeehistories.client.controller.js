'use strict';

// Employeehistories controller
angular.module('employeehistories').controller('EmployeehistoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employeehistories',
	function($scope, $stateParams, $location, Authentication, Employeehistories) {
		$scope.authentication = Authentication;

		// Create new Employeehistory
		$scope.create = function() {
			// Create new Employeehistory object
			var employeehistory = new Employeehistories ({
				name: this.name
			});

			// Redirect after save
			employeehistory.$save(function(response) {
				$location.path('employeehistories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Employeehistory
		$scope.remove = function(employeehistory) {
			if ( employeehistory ) { 
				employeehistory.$remove();

				for (var i in $scope.employeehistories) {
					if ($scope.employeehistories [i] === employeehistory) {
						$scope.employeehistories.splice(i, 1);
					}
				}
			} else {
				$scope.employeehistory.$remove(function() {
					$location.path('employeehistories');
				});
			}
		};

		// Update existing Employeehistory
		$scope.update = function() {
			var employeehistory = $scope.employeehistory;

			employeehistory.$update(function() {
				$location.path('employeehistories/' + employeehistory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Employeehistories
		$scope.find = function() {
			$scope.employeehistories = Employeehistories.query();
		};

		// Find existing Employeehistory
		$scope.findOne = function() {
			$scope.employeehistory = Employeehistories.get({ 
				employeehistoryId: $stateParams.employeehistoryId
			});
		};
	}
]);