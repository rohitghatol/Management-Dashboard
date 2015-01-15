'use strict';

// Organizationhistories controller
angular.module('organizationhistories').controller('OrganizationhistoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organizationhistories',
	function($scope, $stateParams, $location, Authentication, Organizationhistories) {
		$scope.authentication = Authentication;

		// Create new Organizationhistory
		$scope.create = function() {
			// Create new Organizationhistory object
			var organizationhistory = new Organizationhistories ({
				name: this.name
			});

			// Redirect after save
			organizationhistory.$save(function(response) {
				$location.path('organizationhistories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Organizationhistory
		$scope.remove = function(organizationhistory) {
			if ( organizationhistory ) { 
				organizationhistory.$remove();

				for (var i in $scope.organizationhistories) {
					if ($scope.organizationhistories [i] === organizationhistory) {
						$scope.organizationhistories.splice(i, 1);
					}
				}
			} else {
				$scope.organizationhistory.$remove(function() {
					$location.path('organizationhistories');
				});
			}
		};

		// Update existing Organizationhistory
		$scope.update = function() {
			var organizationhistory = $scope.organizationhistory;

			organizationhistory.$update(function() {
				$location.path('organizationhistories/' + organizationhistory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organizationhistories
		$scope.find = function() {
			$scope.organizationhistories = Organizationhistories.query();
		};

		// Find existing Organizationhistory
		$scope.findOne = function() {
			$scope.organizationhistory = Organizationhistories.get({ 
				organizationhistoryId: $stateParams.organizationhistoryId
			});
		};
	}
]);