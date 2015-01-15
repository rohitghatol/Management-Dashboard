'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employeehistory Schema
 */
var EmployeehistorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Employeehistory name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Employeehistory', EmployeehistorySchema);