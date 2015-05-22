var assert = require('assert');
var Metalsmith = require('metalsmith');
var collectionScoping = require('..');
var collections = require('metalsmith-collections');

describe('metalsmith-collection-scoping', function() {

    it('should remove private collections with no scope option', function(done) {
      var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {},
            secrets: {
                metadata: { private: true }
            }
        }))
        .use(collectionScoping())
        .build(function(err) {
            if (err) return(done(err));
            var m = metalsmith.metadata();
            assert.notEqual(m.articles,null);
            assert.notEqual(m.collections.articles,null);
            assert.equal(m.secrets,null);
            assert.equal(m.collections.secrets,null);
            done();
        });
    });

    it('should remove private collections with non-private scope option', function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {},
            secrets: {
                metadata: { private: true }
            }
        }))
        .use(collectionScoping({scope: 'public'}))
        .build(function(err) {
            if (err) return(done(err));
            var m = metalsmith.metadata();
            assert.notEqual(m.articles,null);
            assert.notEqual(m.collections.articles,null);
            assert.equal(m.secrets,null);
            assert.equal(m.collections.secrets,null);
            done();
        });
    });

    it('should retain private collections with private scope option', function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {},
            secrets: {
                metadata: { private: true }
            }
        }))
        .use(collectionScoping({scope: 'private'}))
        .build(function(err) {
            if (err) return(done(err));
            var m = metalsmith.metadata();
            assert.notEqual(m.articles,null);
            assert.notEqual(m.collections.articles,null);
            assert.notEqual(m.secrets,null);
            assert.notEqual(m.collections.secrets,null);
            done();
        });
    });

    it("should add 'private' metadata for files in private collections", function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {},
            secrets: {
                metadata: { private: true }
            }
        }))
        .use(collectionScoping({propagate: true}))
        .build(function(err, files) {
            assert.equal(files['three.md'].private, true);
            assert.equal(files['four.md'].private, true);
            assert.equal(files['one.md'].private, undefined);
            assert.equal(files['five.md'].private, undefined);
            done();
        });
    });

    it("should remove private files from collections for non-private scope", function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {}
        }))
        .use(collectionScoping())
        .build(function(err) {
            var m = metalsmith.metadata();
            m.collections.articles.forEach(function(page) {
                assert.equal(page["private"],null);
            });
            m.articles.forEach(function(page) {
                assert.equal(page["private"],null);
            });
            assert.equal(m.collections.articles.length,1);
            assert.equal(m.articles.length,1);
            done();
        });
    });

    it("should leave private files in collections for private scope", function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {}
        }))
        .use(collectionScoping({scope: 'private'}))
        .build(function(err) {
            var m = metalsmith.metadata();
            assert.equal(m.collections.articles.length, 2);
            assert.equal(m.articles.length,2);
            done();
        });
    });

    it("should not remove metadata when removing private files from collections", function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
        .use(collections({
            articles: {
                metadata: { foo: 'bar' }
            }
        }))
        .use(collectionScoping({scope: 'private'}))
        .build(function(err) {
            var m = metalsmith.metadata();
            assert.equal(m.collections.articles.metadata.foo, 'bar');
            assert.equal(m.articles.metadata.foo, 'bar');
            done();
        });
    });

});
