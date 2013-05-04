var spritesmith = require('spritesmith'),
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path');

function ExtFormat() {
  this.formatObj = {};
}
ExtFormat.prototype = {
  'add': function (name, val) {
    this.formatObj[name] = val;
  },
  'get': function (filepath) {
    // Grab the extension from the filepath
    var ext = path.extname(filepath),
        lowerExt = ext.toLowerCase();

    // Look up the file extenion from our format object
    var formatObj = this.formatObj,
        format = formatObj[lowerExt];
    return format;
  }
};

// Create img and css formats
var imgFormats = new ExtFormat(),
    cssFormats = new ExtFormat();

// Add our img formats
imgFormats.add('.png', 'png');
imgFormats.add('.jpg', 'jpeg');
imgFormats.add('.jpeg', 'jpeg');

// Add our css formats
cssFormats.add('.styl', 'stylus');
cssFormats.add('.stylus', 'stylus');
cssFormats.add('.sass', 'sass');
cssFormats.add('.scss', 'scss');
cssFormats.add('.less', 'less');
cssFormats.add('.json', 'json');

module.exports = function (grunt) {
	'use strict';

	// Create a SpriteMaker function
	function SpriteMaker() {
		var data = this.data,
			that = this,
			options = this.options({
				engine: 'auto',
				algorithm: 'top-down',
			});

		grunt.verbose.writeflags(options, 'Options');
		grunt.verbose.writeflags(data, 'Data');

		// Create an async callback
		var cb = this.async(),
			spriteCount = 0;

		this.files.forEach(function(sprite) {
// has everyting!
grunt.verbose.writeflags(sprite, 'Sprite');
			var exportOpts = sprite.imgOpts || {};
			_.defaults(exportOpts, options.imgOpts);
			_.defaults(exportOpts, {'format': imgFormats.get(sprite.dest) || 'png'});

			var spritesmithParams = {
				src: sprite.src,
				engine: options.engine,
				algorithm: options.algorithm,
				exportOpts: exportOpts
			};
			spritesmith(spritesmithParams, function (err, result) {
				// If an error occurred, callback with it
				if (err) {
					grunt.fatal(err);
					return cb(err);
				}

				// Otherwise, write out the result to destImg
				var destDir = path.dirname(sprite.dest);
				grunt.file.mkdir(destDir);
				fs.writeFileSync(sprite.dest, result.image, 'binary');

				// Otherwise, print a success message.
				grunt.log.writeln('Files "' + sprite.dest + '" created.');

				if (typeof sprite.processor === 'function') {
					sprite.processor(grunt, data, sprite, result);
				}

				// Callback
				spriteCount++;
				if (spriteCount == that.files.length) {
					cb(true);
				}
			});
		});
	}

	// Export the SpriteMaker function
	grunt.registerMultiTask('sprite', 'Spritesheet making utility', SpriteMaker);
};

module.exports.css = function(file) {
	return function(grunt, data, sprite, result) {
		grunt.verbose.writeflags(result.coordinates, sprite.dest + ' coordinates');
	};
};
