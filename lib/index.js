"use strict";

var debug = require('debug')('metalsmith-collection-scoping');

module.exports = function(opts) {

	opts = opts || {};

	return(function(files, metalsmith, done) {

		var m = metalsmith.metadata();
		var privateCollections = {};

		Object.keys(m.collections).forEach(function(key) {
			if (m.collections[key].metadata) {
				if (opts.scope !== 'private' && m.collections[key].metadata.private === true) {
					debug('Deleting private collection: ' + key);
					privateCollections[key] = true;
					delete(m.collections[key]);
					delete(m[key]);
				}
			}
		});
		
		if (opts.privatizeFiles === true) {
			Object.keys(files).forEach(function(file) {
				if (privateCollections[files[file].collection] === true) {
					debug('Privatizing file: ' + file);
					files[file].private = true;
				}
			});
		}

		done();

	});

}