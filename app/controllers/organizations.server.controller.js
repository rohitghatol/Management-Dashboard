'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organization = mongoose.model('Organization'),
    OrganizationHistory = mongoose.model('Organizationhistory'),
    User = mongoose.model('User'),
	_ = require('lodash');

//FIXME - Implement this design - http://www.jramoyo.com/2014/07/mongodb-transaction-across-multiple.html
var record=function(organization,action,callback){
    var clonedObj = JSON.parse(JSON.stringify(organization));
    clonedObj.ref=clonedObj._id;
    clonedObj._id=null;
    clonedObj.action=action;
    clonedObj.user = (typeof clonedObj.user === 'string')?clonedObj.user:clonedObj.user._id;
    clonedObj.owner = (typeof clonedObj.owner === 'string')?clonedObj.owner:clonedObj.owner._id;
    var organizationHistory = new OrganizationHistory(clonedObj);
    organizationHistory.save(function(err,organization) {
       callback(err,organization);
    });
};
/**
 * Create a Organization
 */
exports.create = function(req, res) {
    var owner = new User(req.body.owner);
    req.body.owner = null;
	var organization = new Organization(req.body);

	organization.user = req.user;
    organization.owner = owner;

    //TODO - Reverse the save, lets first save to History and then to Original, so if History fails entire Operation fails
    //Or Use the Rollback mechanism as mentioned here - Implement this design - http://www.jramoyo.com/2014/07/mongodb-transaction-across-multiple.html
	organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            record(organization,'create',function(err){
                if (err,organization) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else{
                    res.jsonp(organization);
                }
            });

		}
	});
};

/**
 * Show the current Organization
 */
exports.read = function(req, res) {
	res.jsonp(req.organization);
};

/**
 * Update a Organization
 */
exports.update = function(req, res) {
	var organization = req.organization ;
	organization = _.extend(organization , req.body);

	organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            record(organization,'update',function(err,organization){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else{
                    res.jsonp(organization);
                }
            });
		}
	});
};

/**
 * Delete an Organization
 */
exports.delete = function(req, res) {
	var organization = req.organization ;

	organization.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            record(organization,'delete',function(err,organization){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else{
                    res.jsonp(organization);
                }
            });
		}
	});
};

/**
 * List of Organizations
 */
exports.list = function(req, res) { 
	Organization.find().sort('-created').populate('user', 'displayName').populate('owner', 'displayName').exec(function(err, organizations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			res.jsonp(organizations);
		}
	});
};

/**
 * Organization middleware
 */
exports.organizationByID = function(req, res, next, id) { 
	Organization.findById(id).populate('user', 'displayName').populate('owner', 'displayName').exec(function(err, organization) {
		if (err) return next(err);
		if (! organization) return next(new Error('Failed to load Organization ' + id));
		req.organization = organization ;
		next();
	});
};

/**
 * Organization authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.organization.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
