'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Projecthistory = mongoose.model('Projecthistory'),
	_ = require('lodash');

/**
 * Create a Projecthistory
 */
exports.create = function(req, res) {
	var projecthistory = new Projecthistory(req.body);
	projecthistory.user = req.user;

	projecthistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projecthistory);
		}
	});
};

/**
 * Show the current Projecthistory
 */
exports.read = function(req, res) {
	res.jsonp(req.projecthistory);
};

/**
 * Update a Projecthistory
 */
exports.update = function(req, res) {
	var projecthistory = req.projecthistory ;

	projecthistory = _.extend(projecthistory , req.body);

	projecthistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projecthistory);
		}
	});
};

/**
 * Delete an Projecthistory
 */
exports.delete = function(req, res) {
	var projecthistory = req.projecthistory ;

	projecthistory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projecthistory);
		}
	});
};

/**
 * List of Projecthistories
 */
exports.list = function(req, res) { 
	Projecthistory.find().sort('-created').populate('user', 'displayName').exec(function(err, projecthistories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projecthistories);
		}
	});
};

/**
 * Projecthistory middleware
 */
exports.projecthistoryByID = function(req, res, next, id) { 
	Projecthistory.findById(id).populate('user', 'displayName').exec(function(err, projecthistory) {
		if (err) return next(err);
		if (! projecthistory) return next(new Error('Failed to load Projecthistory ' + id));
		req.projecthistory = projecthistory ;
		next();
	});
};

/**
 * Projecthistory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projecthistory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
