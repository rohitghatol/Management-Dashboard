'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organizationhistory = mongoose.model('Organizationhistory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, organizationhistory;

/**
 * Organizationhistory routes tests
 */
describe('Organizationhistory CRUD tests', function() {
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

		// Save a user to the test db and create new Organizationhistory
		user.save(function() {
			organizationhistory = {
				name: 'Organizationhistory Name'
			};

			done();
		});
	});

	it('should be able to save Organizationhistory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organizationhistory
				agent.post('/organizationhistories')
					.send(organizationhistory)
					.expect(200)
					.end(function(organizationhistorySaveErr, organizationhistorySaveRes) {
						// Handle Organizationhistory save error
						if (organizationhistorySaveErr) done(organizationhistorySaveErr);

						// Get a list of Organizationhistories
						agent.get('/organizationhistories')
							.end(function(organizationhistoriesGetErr, organizationhistoriesGetRes) {
								// Handle Organizationhistory save error
								if (organizationhistoriesGetErr) done(organizationhistoriesGetErr);

								// Get Organizationhistories list
								var organizationhistories = organizationhistoriesGetRes.body;

								// Set assertions
								(organizationhistories[0].user._id).should.equal(userId);
								(organizationhistories[0].name).should.match('Organizationhistory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Organizationhistory instance if not logged in', function(done) {
		agent.post('/organizationhistories')
			.send(organizationhistory)
			.expect(401)
			.end(function(organizationhistorySaveErr, organizationhistorySaveRes) {
				// Call the assertion callback
				done(organizationhistorySaveErr);
			});
	});

	it('should not be able to save Organizationhistory instance if no name is provided', function(done) {
		// Invalidate name field
		organizationhistory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organizationhistory
				agent.post('/organizationhistories')
					.send(organizationhistory)
					.expect(400)
					.end(function(organizationhistorySaveErr, organizationhistorySaveRes) {
						// Set message assertion
						(organizationhistorySaveRes.body.message).should.match('Please fill Organizationhistory name');
						
						// Handle Organizationhistory save error
						done(organizationhistorySaveErr);
					});
			});
	});

	it('should be able to update Organizationhistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organizationhistory
				agent.post('/organizationhistories')
					.send(organizationhistory)
					.expect(200)
					.end(function(organizationhistorySaveErr, organizationhistorySaveRes) {
						// Handle Organizationhistory save error
						if (organizationhistorySaveErr) done(organizationhistorySaveErr);

						// Update Organizationhistory name
						organizationhistory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Organizationhistory
						agent.put('/organizationhistories/' + organizationhistorySaveRes.body._id)
							.send(organizationhistory)
							.expect(200)
							.end(function(organizationhistoryUpdateErr, organizationhistoryUpdateRes) {
								// Handle Organizationhistory update error
								if (organizationhistoryUpdateErr) done(organizationhistoryUpdateErr);

								// Set assertions
								(organizationhistoryUpdateRes.body._id).should.equal(organizationhistorySaveRes.body._id);
								(organizationhistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Organizationhistories if not signed in', function(done) {
		// Create new Organizationhistory model instance
		var organizationhistoryObj = new Organizationhistory(organizationhistory);

		// Save the Organizationhistory
		organizationhistoryObj.save(function() {
			// Request Organizationhistories
			request(app).get('/organizationhistories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Organizationhistory if not signed in', function(done) {
		// Create new Organizationhistory model instance
		var organizationhistoryObj = new Organizationhistory(organizationhistory);

		// Save the Organizationhistory
		organizationhistoryObj.save(function() {
			request(app).get('/organizationhistories/' + organizationhistoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', organizationhistory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Organizationhistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organizationhistory
				agent.post('/organizationhistories')
					.send(organizationhistory)
					.expect(200)
					.end(function(organizationhistorySaveErr, organizationhistorySaveRes) {
						// Handle Organizationhistory save error
						if (organizationhistorySaveErr) done(organizationhistorySaveErr);

						// Delete existing Organizationhistory
						agent.delete('/organizationhistories/' + organizationhistorySaveRes.body._id)
							.send(organizationhistory)
							.expect(200)
							.end(function(organizationhistoryDeleteErr, organizationhistoryDeleteRes) {
								// Handle Organizationhistory error error
								if (organizationhistoryDeleteErr) done(organizationhistoryDeleteErr);

								// Set assertions
								(organizationhistoryDeleteRes.body._id).should.equal(organizationhistorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Organizationhistory instance if not signed in', function(done) {
		// Set Organizationhistory user 
		organizationhistory.user = user;

		// Create new Organizationhistory model instance
		var organizationhistoryObj = new Organizationhistory(organizationhistory);

		// Save the Organizationhistory
		organizationhistoryObj.save(function() {
			// Try deleting Organizationhistory
			request(app).delete('/organizationhistories/' + organizationhistoryObj._id)
			.expect(401)
			.end(function(organizationhistoryDeleteErr, organizationhistoryDeleteRes) {
				// Set message assertion
				(organizationhistoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Organizationhistory error error
				done(organizationhistoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Organizationhistory.remove().exec();
		done();
	});
});