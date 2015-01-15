'use strict';

(function() {
	// Organizationhistories Controller Spec
	describe('Organizationhistories Controller Tests', function() {
		// Initialize global variables
		var OrganizationhistoriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Organizationhistories controller.
			OrganizationhistoriesController = $controller('OrganizationhistoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Organizationhistory object fetched from XHR', inject(function(Organizationhistories) {
			// Create sample Organizationhistory using the Organizationhistories service
			var sampleOrganizationhistory = new Organizationhistories({
				name: 'New Organizationhistory'
			});

			// Create a sample Organizationhistories array that includes the new Organizationhistory
			var sampleOrganizationhistories = [sampleOrganizationhistory];

			// Set GET response
			$httpBackend.expectGET('organizationhistories').respond(sampleOrganizationhistories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organizationhistories).toEqualData(sampleOrganizationhistories);
		}));

		it('$scope.findOne() should create an array with one Organizationhistory object fetched from XHR using a organizationhistoryId URL parameter', inject(function(Organizationhistories) {
			// Define a sample Organizationhistory object
			var sampleOrganizationhistory = new Organizationhistories({
				name: 'New Organizationhistory'
			});

			// Set the URL parameter
			$stateParams.organizationhistoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/organizationhistories\/([0-9a-fA-F]{24})$/).respond(sampleOrganizationhistory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organizationhistory).toEqualData(sampleOrganizationhistory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Organizationhistories) {
			// Create a sample Organizationhistory object
			var sampleOrganizationhistoryPostData = new Organizationhistories({
				name: 'New Organizationhistory'
			});

			// Create a sample Organizationhistory response
			var sampleOrganizationhistoryResponse = new Organizationhistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Organizationhistory'
			});

			// Fixture mock form input values
			scope.name = 'New Organizationhistory';

			// Set POST response
			$httpBackend.expectPOST('organizationhistories', sampleOrganizationhistoryPostData).respond(sampleOrganizationhistoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Organizationhistory was created
			expect($location.path()).toBe('/organizationhistories/' + sampleOrganizationhistoryResponse._id);
		}));

		it('$scope.update() should update a valid Organizationhistory', inject(function(Organizationhistories) {
			// Define a sample Organizationhistory put data
			var sampleOrganizationhistoryPutData = new Organizationhistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Organizationhistory'
			});

			// Mock Organizationhistory in scope
			scope.organizationhistory = sampleOrganizationhistoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/organizationhistories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organizationhistories/' + sampleOrganizationhistoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid organizationhistoryId and remove the Organizationhistory from the scope', inject(function(Organizationhistories) {
			// Create new Organizationhistory object
			var sampleOrganizationhistory = new Organizationhistories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Organizationhistories array and include the Organizationhistory
			scope.organizationhistories = [sampleOrganizationhistory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/organizationhistories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOrganizationhistory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.organizationhistories.length).toBe(0);
		}));
	});
}());