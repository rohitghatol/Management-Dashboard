'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organizationhistory Schema
 */
var OrganizationhistorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Organizationhistory name',
		trim: true
	},
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    totalPeople: {
        type: Number,
        required: 'Please fill total people count in the Organization'
    },
    billablePeople: {
        type: Number,
        required: 'Please fill billable people count in the Organization'
    },
    benchPeople: {
        type: Number,
        required: 'Please fill bench people count in the Organization'
    },
    openPositions: {
        type: Number,
        required: 'Please fill open Positions count in the Organization'
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    ref:{
        type:Schema.ObjectId,
        ref:'Organization'
    },
    version:{
        type:Number
    },
    action:{
        type:String
    },
	recorded: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Organizationhistory', OrganizationhistorySchema);