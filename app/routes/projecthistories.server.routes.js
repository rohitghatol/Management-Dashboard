'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projecthistories = require('../../app/controllers/projecthistories.server.controller');

	// Projecthistories Routes
	app.route('/projecthistories')
		.get(projecthistories.list)
		.post(users.requiresLogin, projecthistories.create);

	app.route('/projecthistories/:projecthistoryId')
		.get(projecthistories.read)
		.put(users.requiresLogin, projecthistories.hasAuthorization, projecthistories.update)
		.delete(users.requiresLogin, projecthistories.hasAuthorization, projecthistories.delete);

	// Finish by binding the Projecthistory middleware
	app.param('projecthistoryId', projecthistories.projecthistoryByID);
};
