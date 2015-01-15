'use strict';

//Organizationhistories service used to communicate Organizationhistories REST endpoints
angular.module('organizationhistories').factory('Organizationhistories', ['$resource',
	function($resource) {
		return $resource('organizationhistories/:organizationhistoryId', { organizationhistoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);