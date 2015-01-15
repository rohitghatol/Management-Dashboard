'use strict';

//Employeehistories service used to communicate Employeehistories REST endpoints
angular.module('employeehistories').factory('Employeehistories', ['$resource',
	function($resource) {
		return $resource('employeehistories/:employeehistoryId', { employeehistoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);