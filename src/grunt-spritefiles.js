var spritesmith = require('spritesmith'),
    json2css = require('json2css'),
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	url = require('url2');

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

		// and a process function so we can build only one sprite at a time
		// (otherwise we open too many files)
		var processSprite = function(files, i) {
			if (i >= files.length) {
				done(true);
				return;
			}
			var sprite = files[i],
				exportOpts = sprite.imgOpts || {};
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
					return done(err);
				}

				// Otherwise, write out the result to destImg
				var destDir = path.dirname(sprite.dest);
				grunt.file.mkdir(destDir);
				fs.writeFileSync(sprite.dest, result.image, 'binary');

				// Otherwise, print a success message.
				grunt.log.writeln('Sprite "' + sprite.dest + '" created.');

// FIXME support processor in any config location
				if (typeof sprite.processor === 'function') {
					sprite.processor(grunt, data, sprite, result);
				}

				// Callback next sprite
				i++;
				processSprite(files, i);
			});
		};

		if (this.files) {
			// Create an async grunt callback
			var done = this.async();
			processSprite(this.files, 0);
		} else {
			grunt.log.log('Task does not have any files');
		}
	}

	// Export the SpriteMaker function
	grunt.registerMultiTask('sprite', 'Spritesheet making utility', SpriteMaker);
};

module.exports.cssFile = function(cssFile, opts) {
	var options = opts || {};
	return function(grunt, that, sprite, result) {

		// Generate a listing of CSS variables
		var coordinates = result.coordinates,
			cleanCoords = {};

		// Clean up the file name of the file
		Object.getOwnPropertyNames(coordinates).forEach(function (file) {
			// Extract the image name (exlcuding extension)
			var fullname = path.basename(file),
					nameParts = fullname.split('.');

			// If there is are more than 2 parts, pop the last one
			if (nameParts.length >= 2) {
				nameParts.pop();
			}

			// Extract out our name
			var name = nameParts.join('.'),
					coords = coordinates[file];

			// Save the cleaned name and coordinates
			cleanCoords[name] = coords;
		});

		// Render the variables via json2css
		var cssFormat = options.format || cssFormats.get(cssFile) || 'json',
				spritePath = options.imgPath || url.relative(cssFile, sprite.dest),
				formatOpts = {
					'spritePath': spritePath
				},
				cssStr = json2css(cleanCoords, {'format': cssFormat, 'formatOpts': formatOpts});

		// Write it out to the CSS file
		var cssDir = path.dirname(cssFile);
		grunt.file.mkdir(cssDir);
		fs.writeFileSync(cssFile, cssStr, 'utf8');

		grunt.log.writeln('CSS "' + cssFile + '" created.');

		return true;
	};
};
