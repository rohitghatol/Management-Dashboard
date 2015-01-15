'use strict';

//Setting up route
angular.module('employeehistories').config(['$stateProvider',
	function($stateProvider) {
		// Employeehistories state routing
		$stateProvider.
		state('listEmployeehistories', {
			url: '/employeehistories',
			templateUrl: 'modules/employeehistories/views/list-employeehistories.client.view.html'
		}).
		state('createEmployeehistory', {
			url: '/employeehistories/create',
			templateUrl: 'modules/employeehistories/views/create-employeehistory.client.view.html'
		}).
		state('viewEmployeehistory', {
			url: '/employeehistories/:employeehistoryId',
			templateUrl: 'modules/employeehistories/views/view-employeehistory.client.view.html'
		}).
		state('editEmployeehistory', {
			url: '/employeehistories/:employeehistoryId/edit',
			templateUrl: 'modules/employeehistories/views/edit-employeehistory.client.view.html'
		});
	}
]);