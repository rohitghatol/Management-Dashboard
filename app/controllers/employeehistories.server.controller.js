'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Employeehistory = mongoose.model('Employeehistory'),
	_ = require('lodash');

/**
 * Create a Employeehistory
 */
exports.create = function(req, res) {
	var employeehistory = new Employeehistory(req.body);
	employeehistory.user = req.user;

	employeehistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeehistory);
		}
	});
};

/**
 * Show the current Employeehistory
 */
exports.read = function(req, res) {
	res.jsonp(req.employeehistory);
};

/**
 * Update a Employeehistory
 */
exports.update = function(req, res) {
	var employeehistory = req.employeehistory ;

	employeehistory = _.extend(employeehistory , req.body);

	employeehistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeehistory);
		}
	});
};

/**
 * Delete an Employeehistory
 */
exports.delete = function(req, res) {
	var employeehistory = req.employeehistory ;

	employeehistory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeehistory);
		}
	});
};

/**
 * List of Employeehistories
 */
exports.list = function(req, res) { 
	Employeehistory.find().sort('-created').populate('user', 'displayName').exec(function(err, employeehistories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeehistories);
		}
	});
};

/**
 * Employeehistory middleware
 */
exports.employeehistoryByID = function(req, res, next, id) { 
	Employeehistory.findById(id).populate('user', 'displayName').exec(function(err, employeehistory) {
		if (err) return next(err);
		if (! employeehistory) return next(new Error('Failed to load Employeehistory ' + id));
		req.employeehistory = employeehistory ;
		next();
	});
};

/**
 * Employeehistory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.employeehistory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
