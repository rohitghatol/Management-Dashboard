'use strict';

//Projecthistories service used to communicate Projecthistories REST endpoints
angular.module('projecthistories').factory('Projecthistories', ['$resource',
	function($resource) {
		return $resource('projecthistories/:projecthistoryId', { projecthistoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);