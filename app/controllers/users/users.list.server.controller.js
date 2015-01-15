/**
 * Created by rohitghatol on 1/14/15.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./../errors.server.controller'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 *
 * @param req
 * @param res
 */
exports.list = function(req, res) {
    User.find({}).select('_id displayName').sort('-created').populate('_id', 'displayName').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(users);
            res.jsonp(users);
        }
    });
};