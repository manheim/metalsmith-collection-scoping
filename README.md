# metalsmith-collection-scoping

A [Metalsmith](https://github.com/segmentio/metalsmith) plugin that lets you apply scoping to collections.

## Features

  - Mark [collections](https://github.com/segmentio/metalsmith-collections) as private and specify at build time whether to include them
  - Propagate private collections down to matching files, for use in [metalsmith-scoping](https://github.com/lotaris/metalsmith-scoping)

## Installation

	$ npm install metalsmith-collection-scoping

## Usage

This plugin is meant to be used with two existing plugins: metalsmith-collections and metalsmith-scoping.  For example:

```json
{
	"plugins": {
		"metalsmith-collections": {
			"articles": {
        		"sortBy": "date",
        		"reverse": true
        	},
        	"secrets": {
        		metadata: {
        			"private": true
        		}
        	}
      	},
      	"metalsmith-collection-scoping": {
      		"scope": "public"
      	}
	}
}

```
will remove the "secrets" collection from the metalsmith metadata.  If you also want the files in the "secrets" collection to be private, you can add the "propagate" option and include metalsmith-scoping:

```json
{
	"plugins": {
		"metalsmith-collections": {
			"articles": {
        		"sortBy": "date",
        		"reverse": true
        	},
        	"secrets": {
        		metadata: {
        			"private": true
        		}
        	}
      	},
      	"metalsmith-collection-scoping": {
      		"scope": "public",
      		"propagate" true
      	},
      	"metalsmith-scoping": {
      		"scope": "public"
      	}
	}
}
```
This will set the "private" metadata on each of the files in the "secrets" collection.  Then metalsmith-scoping will pick this up and hide them.

## Options

  - `scope` is the same as the same option in metalsmith-scoping.  When set to `private` it will include private collections, otherwise discard them.  Default is to discard private collections.
  - `propagate` determines whether to propagate private collection scopes to matching files.  Default is `false`.  This option can be used independently of the `scope` option.

See the tests for more examples.

Where do we use this?  On our [developer portal](http://developer.manheim.com)!