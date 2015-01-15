'use strict';

(function() {
	// Projecthistories Controller Spec
	describe('Projecthistories Controller Tests', function() {
		// Initialize global variables
		var ProjecthistoriesController,
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

			// Initialize the Projecthistories controller.
			ProjecthistoriesController = $controller('ProjecthistoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Projecthistory object fetched from XHR', inject(function(Projecthistories) {
			// Create sample Projecthistory using the Projecthistories service
			var sampleProjecthistory = new Projecthistories({
				name: 'New Projecthistory'
			});

			// Create a sample Projecthistories array that includes the new Projecthistory
			var sampleProjecthistories = [sampleProjecthistory];

			// Set GET response
			$httpBackend.expectGET('projecthistories').respond(sampleProjecthistories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projecthistories).toEqualData(sampleProjecthistories);
		}));

		it('$scope.findOne() should create an array with one Projecthistory object fetched from XHR using a projecthistoryId URL parameter', inject(function(Projecthistories) {
			// Define a sample Projecthistory object
			var sampleProjecthistory = new Projecthistories({
				name: 'New Projecthistory'
			});

			// Set the URL parameter
			$stateParams.projecthistoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/projecthistories\/([0-9a-fA-F]{24})$/).respond(sampleProjecthistory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projecthistory).toEqualData(sampleProjecthistory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Projecthistories) {
			// Create a sample Projecthistory object
			var sampleProjecthistoryPostData = new Projecthistories({
				name: 'New Projecthistory'
			});

			// Create a sample Projecthistory response
			var sampleProjecthistoryResponse = new Projecthistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Projecthistory'
			});

			// Fixture mock form input values
			scope.name = 'New Projecthistory';

			// Set POST response
			$httpBackend.expectPOST('projecthistories', sampleProjecthistoryPostData).respond(sampleProjecthistoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Projecthistory was created
			expect($location.path()).toBe('/projecthistories/' + sampleProjecthistoryResponse._id);
		}));

		it('$scope.update() should update a valid Projecthistory', inject(function(Projecthistories) {
			// Define a sample Projecthistory put data
			var sampleProjecthistoryPutData = new Projecthistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Projecthistory'
			});

			// Mock Projecthistory in scope
			scope.projecthistory = sampleProjecthistoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/projecthistories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/projecthistories/' + sampleProjecthistoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projecthistoryId and remove the Projecthistory from the scope', inject(function(Projecthistories) {
			// Create new Projecthistory object
			var sampleProjecthistory = new Projecthistories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Projecthistories array and include the Projecthistory
			scope.projecthistories = [sampleProjecthistory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/projecthistories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjecthistory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projecthistories.length).toBe(0);
		}));
	});
}());