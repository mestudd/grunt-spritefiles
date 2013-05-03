var spritesmith = require('spritesmith');

module.exports = function (grunt) {
	'use strict';

	// Create a SpriteMaker function
	function SpriteMaker() {
		var data = this.data,
			options = this.options({});

		grunt.verbose.writeflags(options, 'Options');
		grunt.verbose.writeflags(data, 'Data');

		this.files.forEach(function(filePair) {
grunt.verbose.writeln(filePair.dest);
		});
	}

	// Export the SpriteMaker function
	grunt.registerMultiTask('sprite', 'Spritesheet making utility', SpriteMaker);
};
