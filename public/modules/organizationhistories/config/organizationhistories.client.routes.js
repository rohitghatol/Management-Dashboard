'use strict';

//Setting up route
angular.module('organizationhistories').config(['$stateProvider',
	function($stateProvider) {
		// Organizationhistories state routing
		$stateProvider.
		state('listOrganizationhistories', {
			url: '/organizationhistories',
			templateUrl: 'modules/organizationhistories/views/list-organizationhistories.client.view.html'
		}).
		state('createOrganizationhistory', {
			url: '/organizationhistories/create',
			templateUrl: 'modules/organizationhistories/views/create-organizationhistory.client.view.html'
		}).
		state('viewOrganizationhistory', {
			url: '/organizationhistories/:organizationhistoryId',
			templateUrl: 'modules/organizationhistories/views/view-organizationhistory.client.view.html'
		}).
		state('editOrganizationhistory', {
			url: '/organizationhistories/:organizationhistoryId/edit',
			templateUrl: 'modules/organizationhistories/views/edit-organizationhistory.client.view.html'
		});
	}
]);