'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Projecthistory = mongoose.model('Projecthistory');

/**
 * Globals
 */
var user, projecthistory;

/**
 * Unit tests
 */
describe('Projecthistory Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			projecthistory = new Projecthistory({
				name: 'Projecthistory Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projecthistory.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			projecthistory.name = '';

			return projecthistory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Projecthistory.remove().exec();
		User.remove().exec();

		done();
	});
});