'use strict';

//Setting up route
angular.module('projecthistories').config(['$stateProvider',
	function($stateProvider) {
		// Projecthistories state routing
		$stateProvider.
		state('listProjecthistories', {
			url: '/projecthistories',
			templateUrl: 'modules/projecthistories/views/list-projecthistories.client.view.html'
		}).
		state('createProjecthistory', {
			url: '/projecthistories/create',
			templateUrl: 'modules/projecthistories/views/create-projecthistory.client.view.html'
		}).
		state('viewProjecthistory', {
			url: '/projecthistories/:projecthistoryId',
			templateUrl: 'modules/projecthistories/views/view-projecthistory.client.view.html'
		}).
		state('editProjecthistory', {
			url: '/projecthistories/:projecthistoryId/edit',
			templateUrl: 'modules/projecthistories/views/edit-projecthistory.client.view.html'
		});
	}
]);