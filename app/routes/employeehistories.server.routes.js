'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employeehistories = require('../../app/controllers/employeehistories.server.controller');

	// Employeehistories Routes
	app.route('/employeehistories')
		.get(employeehistories.list)
		.post(users.requiresLogin, employeehistories.create);

	app.route('/employeehistories/:employeehistoryId')
		.get(employeehistories.read)
		.put(users.requiresLogin, employeehistories.hasAuthorization, employeehistories.update)
		.delete(users.requiresLogin, employeehistories.hasAuthorization, employeehistories.delete);

	// Finish by binding the Employeehistory middleware
	app.param('employeehistoryId', employeehistories.employeehistoryByID);
};
