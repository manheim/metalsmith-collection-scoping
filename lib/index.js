"use strict";

var debug = require('debug')('metalsmith-collection-scoping');

module.exports = function(opts) {

    opts = opts || {};

    var shouldDelete = function(isPrivate) {
        return(opts.scope !== 'private' && isPrivate === true);
    }

    var reject = function(list, predicate) {

        var newList = [];

        Object.keys(list).forEach(function(key) {
            if (!predicate(list[key])) {
                newList[key] = list[key];
            }
        });

        return(newList);

    }

    return(function(files, metalsmith, done) {

        var m = metalsmith.metadata();
        var privateCollections = {};

        Object.keys(m.collections).forEach(function(key) {
            if (m.collections[key].metadata) {
                if (shouldDelete(m.collections[key].metadata.private)) {
                    debug('Deleting private collection: ' + key);
                    privateCollections[key] = true;
                    delete(m.collections[key]);
                    delete(m[key]);
                }
            }
            if (m.collections[key]) {
                m.collections[key] = reject(m.collections[key], function(page) {
                    return((typeof page === 'object') && shouldDelete(page['private']));
                });
            }
            if (m[key]) {
                m[key] = reject(m[key], function(page) {
                    return((typeof page === 'object') && shouldDelete(page['private']));
                });
            }
        });
        
        if (opts.propagate === true) {
            Object.keys(files).forEach(function(file) {
                if (privateCollections[files[file].collection] === true) {
                    debug('Propagating scope to file: ' + file);
                    files[file].private = true;
                }
            });
        }

        done();

    });

}
