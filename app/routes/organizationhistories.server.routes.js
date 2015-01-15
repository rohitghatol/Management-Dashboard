'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var organizationhistories = require('../../app/controllers/organizationhistories.server.controller');

	// Organizationhistories Routes
	app.route('/organizationhistories')
		.get(organizationhistories.list)
		.post(users.requiresLogin, organizationhistories.create);

	app.route('/organizationhistories/:organizationhistoryId')
		.get(organizationhistories.read)
		.put(users.requiresLogin, organizationhistories.hasAuthorization, organizationhistories.update)
		.delete(users.requiresLogin, organizationhistories.hasAuthorization, organizationhistories.delete);

	// Finish by binding the Organizationhistory middleware
	app.param('organizationhistoryId', organizationhistories.organizationhistoryByID);
};
