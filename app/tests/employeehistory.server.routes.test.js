'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Employeehistory = mongoose.model('Employeehistory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, employeehistory;

/**
 * Employeehistory routes tests
 */
describe('Employeehistory CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Employeehistory
		user.save(function() {
			employeehistory = {
				name: 'Employeehistory Name'
			};

			done();
		});
	});

	it('should be able to save Employeehistory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employeehistory
				agent.post('/employeehistories')
					.send(employeehistory)
					.expect(200)
					.end(function(employeehistorySaveErr, employeehistorySaveRes) {
						// Handle Employeehistory save error
						if (employeehistorySaveErr) done(employeehistorySaveErr);

						// Get a list of Employeehistories
						agent.get('/employeehistories')
							.end(function(employeehistoriesGetErr, employeehistoriesGetRes) {
								// Handle Employeehistory save error
								if (employeehistoriesGetErr) done(employeehistoriesGetErr);

								// Get Employeehistories list
								var employeehistories = employeehistoriesGetRes.body;

								// Set assertions
								(employeehistories[0].user._id).should.equal(userId);
								(employeehistories[0].name).should.match('Employeehistory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Employeehistory instance if not logged in', function(done) {
		agent.post('/employeehistories')
			.send(employeehistory)
			.expect(401)
			.end(function(employeehistorySaveErr, employeehistorySaveRes) {
				// Call the assertion callback
				done(employeehistorySaveErr);
			});
	});

	it('should not be able to save Employeehistory instance if no name is provided', function(done) {
		// Invalidate name field
		employeehistory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employeehistory
				agent.post('/employeehistories')
					.send(employeehistory)
					.expect(400)
					.end(function(employeehistorySaveErr, employeehistorySaveRes) {
						// Set message assertion
						(employeehistorySaveRes.body.message).should.match('Please fill Employeehistory name');
						
						// Handle Employeehistory save error
						done(employeehistorySaveErr);
					});
			});
	});

	it('should be able to update Employeehistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employeehistory
				agent.post('/employeehistories')
					.send(employeehistory)
					.expect(200)
					.end(function(employeehistorySaveErr, employeehistorySaveRes) {
						// Handle Employeehistory save error
						if (employeehistorySaveErr) done(employeehistorySaveErr);

						// Update Employeehistory name
						employeehistory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Employeehistory
						agent.put('/employeehistories/' + employeehistorySaveRes.body._id)
							.send(employeehistory)
							.expect(200)
							.end(function(employeehistoryUpdateErr, employeehistoryUpdateRes) {
								// Handle Employeehistory update error
								if (employeehistoryUpdateErr) done(employeehistoryUpdateErr);

								// Set assertions
								(employeehistoryUpdateRes.body._id).should.equal(employeehistorySaveRes.body._id);
								(employeehistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Employeehistories if not signed in', function(done) {
		// Create new Employeehistory model instance
		var employeehistoryObj = new Employeehistory(employeehistory);

		// Save the Employeehistory
		employeehistoryObj.save(function() {
			// Request Employeehistories
			request(app).get('/employeehistories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Employeehistory if not signed in', function(done) {
		// Create new Employeehistory model instance
		var employeehistoryObj = new Employeehistory(employeehistory);

		// Save the Employeehistory
		employeehistoryObj.save(function() {
			request(app).get('/employeehistories/' + employeehistoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', employeehistory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Employeehistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employeehistory
				agent.post('/employeehistories')
					.send(employeehistory)
					.expect(200)
					.end(function(employeehistorySaveErr, employeehistorySaveRes) {
						// Handle Employeehistory save error
						if (employeehistorySaveErr) done(employeehistorySaveErr);

						// Delete existing Employeehistory
						agent.delete('/employeehistories/' + employeehistorySaveRes.body._id)
							.send(employeehistory)
							.expect(200)
							.end(function(employeehistoryDeleteErr, employeehistoryDeleteRes) {
								// Handle Employeehistory error error
								if (employeehistoryDeleteErr) done(employeehistoryDeleteErr);

								// Set assertions
								(employeehistoryDeleteRes.body._id).should.equal(employeehistorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Employeehistory instance if not signed in', function(done) {
		// Set Employeehistory user 
		employeehistory.user = user;

		// Create new Employeehistory model instance
		var employeehistoryObj = new Employeehistory(employeehistory);

		// Save the Employeehistory
		employeehistoryObj.save(function() {
			// Try deleting Employeehistory
			request(app).delete('/employeehistories/' + employeehistoryObj._id)
			.expect(401)
			.end(function(employeehistoryDeleteErr, employeehistoryDeleteRes) {
				// Set message assertion
				(employeehistoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Employeehistory error error
				done(employeehistoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Employeehistory.remove().exec();
		done();
	});
});