'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Projecthistory = mongoose.model('Projecthistory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projecthistory;

/**
 * Projecthistory routes tests
 */
describe('Projecthistory CRUD tests', function() {
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

		// Save a user to the test db and create new Projecthistory
		user.save(function() {
			projecthistory = {
				name: 'Projecthistory Name'
			};

			done();
		});
	});

	it('should be able to save Projecthistory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projecthistory
				agent.post('/projecthistories')
					.send(projecthistory)
					.expect(200)
					.end(function(projecthistorySaveErr, projecthistorySaveRes) {
						// Handle Projecthistory save error
						if (projecthistorySaveErr) done(projecthistorySaveErr);

						// Get a list of Projecthistories
						agent.get('/projecthistories')
							.end(function(projecthistoriesGetErr, projecthistoriesGetRes) {
								// Handle Projecthistory save error
								if (projecthistoriesGetErr) done(projecthistoriesGetErr);

								// Get Projecthistories list
								var projecthistories = projecthistoriesGetRes.body;

								// Set assertions
								(projecthistories[0].user._id).should.equal(userId);
								(projecthistories[0].name).should.match('Projecthistory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Projecthistory instance if not logged in', function(done) {
		agent.post('/projecthistories')
			.send(projecthistory)
			.expect(401)
			.end(function(projecthistorySaveErr, projecthistorySaveRes) {
				// Call the assertion callback
				done(projecthistorySaveErr);
			});
	});

	it('should not be able to save Projecthistory instance if no name is provided', function(done) {
		// Invalidate name field
		projecthistory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projecthistory
				agent.post('/projecthistories')
					.send(projecthistory)
					.expect(400)
					.end(function(projecthistorySaveErr, projecthistorySaveRes) {
						// Set message assertion
						(projecthistorySaveRes.body.message).should.match('Please fill Projecthistory name');
						
						// Handle Projecthistory save error
						done(projecthistorySaveErr);
					});
			});
	});

	it('should be able to update Projecthistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projecthistory
				agent.post('/projecthistories')
					.send(projecthistory)
					.expect(200)
					.end(function(projecthistorySaveErr, projecthistorySaveRes) {
						// Handle Projecthistory save error
						if (projecthistorySaveErr) done(projecthistorySaveErr);

						// Update Projecthistory name
						projecthistory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Projecthistory
						agent.put('/projecthistories/' + projecthistorySaveRes.body._id)
							.send(projecthistory)
							.expect(200)
							.end(function(projecthistoryUpdateErr, projecthistoryUpdateRes) {
								// Handle Projecthistory update error
								if (projecthistoryUpdateErr) done(projecthistoryUpdateErr);

								// Set assertions
								(projecthistoryUpdateRes.body._id).should.equal(projecthistorySaveRes.body._id);
								(projecthistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Projecthistories if not signed in', function(done) {
		// Create new Projecthistory model instance
		var projecthistoryObj = new Projecthistory(projecthistory);

		// Save the Projecthistory
		projecthistoryObj.save(function() {
			// Request Projecthistories
			request(app).get('/projecthistories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Projecthistory if not signed in', function(done) {
		// Create new Projecthistory model instance
		var projecthistoryObj = new Projecthistory(projecthistory);

		// Save the Projecthistory
		projecthistoryObj.save(function() {
			request(app).get('/projecthistories/' + projecthistoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projecthistory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Projecthistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projecthistory
				agent.post('/projecthistories')
					.send(projecthistory)
					.expect(200)
					.end(function(projecthistorySaveErr, projecthistorySaveRes) {
						// Handle Projecthistory save error
						if (projecthistorySaveErr) done(projecthistorySaveErr);

						// Delete existing Projecthistory
						agent.delete('/projecthistories/' + projecthistorySaveRes.body._id)
							.send(projecthistory)
							.expect(200)
							.end(function(projecthistoryDeleteErr, projecthistoryDeleteRes) {
								// Handle Projecthistory error error
								if (projecthistoryDeleteErr) done(projecthistoryDeleteErr);

								// Set assertions
								(projecthistoryDeleteRes.body._id).should.equal(projecthistorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Projecthistory instance if not signed in', function(done) {
		// Set Projecthistory user 
		projecthistory.user = user;

		// Create new Projecthistory model instance
		var projecthistoryObj = new Projecthistory(projecthistory);

		// Save the Projecthistory
		projecthistoryObj.save(function() {
			// Try deleting Projecthistory
			request(app).delete('/projecthistories/' + projecthistoryObj._id)
			.expect(401)
			.end(function(projecthistoryDeleteErr, projecthistoryDeleteRes) {
				// Set message assertion
				(projecthistoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Projecthistory error error
				done(projecthistoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Projecthistory.remove().exec();
		done();
	});
});