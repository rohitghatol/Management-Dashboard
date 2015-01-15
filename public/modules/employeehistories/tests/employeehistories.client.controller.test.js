'use strict';

(function() {
	// Employeehistories Controller Spec
	describe('Employeehistories Controller Tests', function() {
		// Initialize global variables
		var EmployeehistoriesController,
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

			// Initialize the Employeehistories controller.
			EmployeehistoriesController = $controller('EmployeehistoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Employeehistory object fetched from XHR', inject(function(Employeehistories) {
			// Create sample Employeehistory using the Employeehistories service
			var sampleEmployeehistory = new Employeehistories({
				name: 'New Employeehistory'
			});

			// Create a sample Employeehistories array that includes the new Employeehistory
			var sampleEmployeehistories = [sampleEmployeehistory];

			// Set GET response
			$httpBackend.expectGET('employeehistories').respond(sampleEmployeehistories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeehistories).toEqualData(sampleEmployeehistories);
		}));

		it('$scope.findOne() should create an array with one Employeehistory object fetched from XHR using a employeehistoryId URL parameter', inject(function(Employeehistories) {
			// Define a sample Employeehistory object
			var sampleEmployeehistory = new Employeehistories({
				name: 'New Employeehistory'
			});

			// Set the URL parameter
			$stateParams.employeehistoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/employeehistories\/([0-9a-fA-F]{24})$/).respond(sampleEmployeehistory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeehistory).toEqualData(sampleEmployeehistory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Employeehistories) {
			// Create a sample Employeehistory object
			var sampleEmployeehistoryPostData = new Employeehistories({
				name: 'New Employeehistory'
			});

			// Create a sample Employeehistory response
			var sampleEmployeehistoryResponse = new Employeehistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Employeehistory'
			});

			// Fixture mock form input values
			scope.name = 'New Employeehistory';

			// Set POST response
			$httpBackend.expectPOST('employeehistories', sampleEmployeehistoryPostData).respond(sampleEmployeehistoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Employeehistory was created
			expect($location.path()).toBe('/employeehistories/' + sampleEmployeehistoryResponse._id);
		}));

		it('$scope.update() should update a valid Employeehistory', inject(function(Employeehistories) {
			// Define a sample Employeehistory put data
			var sampleEmployeehistoryPutData = new Employeehistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Employeehistory'
			});

			// Mock Employeehistory in scope
			scope.employeehistory = sampleEmployeehistoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/employeehistories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/employeehistories/' + sampleEmployeehistoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid employeehistoryId and remove the Employeehistory from the scope', inject(function(Employeehistories) {
			// Create new Employeehistory object
			var sampleEmployeehistory = new Employeehistories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Employeehistories array and include the Employeehistory
			scope.employeehistories = [sampleEmployeehistory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/employeehistories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmployeehistory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.employeehistories.length).toBe(0);
		}));
	});
}());