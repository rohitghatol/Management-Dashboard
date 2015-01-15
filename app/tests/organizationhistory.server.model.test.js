'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organizationhistory = mongoose.model('Organizationhistory');

/**
 * Globals
 */
var user, organizationhistory;

/**
 * Unit tests
 */
describe('Organizationhistory Model Unit Tests:', function() {
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
			organizationhistory = new Organizationhistory({
				name: 'Organizationhistory Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return organizationhistory.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			organizationhistory.name = '';

			return organizationhistory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Organizationhistory.remove().exec();
		User.remove().exec();

		done();
	});
});