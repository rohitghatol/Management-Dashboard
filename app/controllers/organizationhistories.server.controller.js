'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organizationhistory = mongoose.model('Organizationhistory'),
	_ = require('lodash');

/**
 * Create a Organizationhistory
 */
exports.create = function(req, res) {
	var organizationhistory = new Organizationhistory(req.body);
	organizationhistory.user = req.user;

	organizationhistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organizationhistory);
		}
	});
};

/**
 * Show the current Organizationhistory
 */
exports.read = function(req, res) {
	res.jsonp(req.organizationhistory);
};

/**
 * Update a Organizationhistory
 */
exports.update = function(req, res) {
	var organizationhistory = req.organizationhistory ;

	organizationhistory = _.extend(organizationhistory , req.body);

	organizationhistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organizationhistory);
		}
	});
};

/**
 * Delete an Organizationhistory
 */
exports.delete = function(req, res) {
	var organizationhistory = req.organizationhistory ;

	organizationhistory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organizationhistory);
		}
	});
};

/**
 * List of Organizationhistories
 */
exports.list = function(req, res) { 
	Organizationhistory.find().sort('-created').populate('user', 'displayName').exec(function(err, organizationhistories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organizationhistories);
		}
	});
};

/**
 * Organizationhistory middleware
 */
exports.organizationhistoryByID = function(req, res, next, id) { 
	Organizationhistory.findById(id).populate('user', 'displayName').exec(function(err, organizationhistory) {
		if (err) return next(err);
		if (! organizationhistory) return next(new Error('Failed to load Organizationhistory ' + id));
		req.organizationhistory = organizationhistory ;
		next();
	});
};

/**
 * Organizationhistory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.organizationhistory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
