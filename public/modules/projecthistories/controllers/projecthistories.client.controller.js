'use strict';

// Projecthistories controller
angular.module('projecthistories').controller('ProjecthistoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projecthistories',
	function($scope, $stateParams, $location, Authentication, Projecthistories) {
		$scope.authentication = Authentication;

		// Create new Projecthistory
		$scope.create = function() {
			// Create new Projecthistory object
			var projecthistory = new Projecthistories ({
				name: this.name
			});

			// Redirect after save
			projecthistory.$save(function(response) {
				$location.path('projecthistories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Projecthistory
		$scope.remove = function(projecthistory) {
			if ( projecthistory ) { 
				projecthistory.$remove();

				for (var i in $scope.projecthistories) {
					if ($scope.projecthistories [i] === projecthistory) {
						$scope.projecthistories.splice(i, 1);
					}
				}
			} else {
				$scope.projecthistory.$remove(function() {
					$location.path('projecthistories');
				});
			}
		};

		// Update existing Projecthistory
		$scope.update = function() {
			var projecthistory = $scope.projecthistory;

			projecthistory.$update(function() {
				$location.path('projecthistories/' + projecthistory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projecthistories
		$scope.find = function() {
			$scope.projecthistories = Projecthistories.query();
		};

		// Find existing Projecthistory
		$scope.findOne = function() {
			$scope.projecthistory = Projecthistories.get({ 
				projecthistoryId: $stateParams.projecthistoryId
			});
		};
	}
]);