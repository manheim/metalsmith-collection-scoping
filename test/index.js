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
      .use(collectionScoping({privatizeFiles: true}))
      .build(function(err, files) {
      	assert.equal(files['three.md'].private, true);
      	assert.equal(files['four.md'].private, true);
      	assert.equal(files['one.md'].private, undefined);
      	assert.equal(files['five.md'].private, undefined);
      	done();
      });
	});
	
});