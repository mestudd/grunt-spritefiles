var sprite = require('./src/grunt-spritefiles.js');

module.exports = function (grunt) {
	grunt.initConfig({
		lint: {
			all: ["grunt.js", "tasks/*.js", "src-test/*.js"]
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			test: ['tmp']
		},

		// Configuration to be run (and then tested).
		sprite: {
			options: { imgOpts: { format: 'png' } },
			degenerate: {
				files: []
			},
			empty: {
				files: { 'tmp/idontexist.png': 'test/fixtures/idontexist.png' }
			},
			compact: {
				src: [ 'test/fixtures/*.png' ],
				dest: 'tmp/compact.png'
			},
			filesObject: {
				files: {
					'tmp/filesObject1.png': ['test/fixtures/sprite1.png', 'test/fixtures/sprite2.jpg'],
					'tmp/filesObject2.png': ['test/fixtures/sprite1.*'],
				}
			},
			filesArray: {
				files: [
					{ dest: 'tmp/array1.png', src: ['test/fixtures/sprite1.png', 'test/fixtures/sprite2.jpg'] },
					{ dest: 'tmp/array2.png', src: ['test/fixtures/sprite3.png', 'test/fixtures/sprite2.jpg'] },
					{ dest: 'tmp/array3.png', src: ['test/fixtures/sprite1.png', 'test/fixtures/sprite3.png'] }
				]
			},
			filesOptions: {
				options: { imgOpts: { format: 'jpg' } },
				files: { 'tmp/filesOptions': ['test/fixtures/sprite1.png', 'test/fixtures/sprite2.jpg'] }
			},
			processor: {
				files: [
					{
						dest: 'tmp/json.png',
						processor: sprite.cssFile('tmp/css.json'),
						src: ['test/fixtures/sprite1.png', 'test/fixtures/sprite2.jpg']
					},
					{
						dest: 'tmp/stylus.png',
						processor: sprite.cssFile('tmp/css.style', { format: 'stylus', imgPath: '/other/stylus.png' }),
						src: ['test/fixtures/sprite1.png', 'test/fixtures/sprite2.jpg']
					},
					{
						dest: 'tmp/less.png',
						processor: sprite.cssFile('tmp/css.less'),
						src: ['test/fixtures/sprite1.png', 'test/fixtures/sprite2.jpg']
					}
				]
			}
		},

		// Unit tests
		nodeunit: {
			tests: ['test/*_test.js']
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// Load plugins defining necessary tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', ['clean', 'sprite', 'nodeunit']);

	grunt.registerTask('default', ['lint']);
};
