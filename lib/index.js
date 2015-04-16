"use strict";

var debug = require('debug')('metalsmith-collection-scoping');

module.exports = function(opts) {

	opts = opts || {};

	return(function(files, metalsmith, done) {

		var m = metalsmith.metadata();

		Object.keys(m.collections).forEach(function(key) {
			if (m.collections[key].metadata) {
				if (opts.scope !== 'private' && m.collections[key].metadata.private === true) {
					delete(m.collections[key]);
					delete(m[key]);
				}
			}
		});

		done();

	});

}