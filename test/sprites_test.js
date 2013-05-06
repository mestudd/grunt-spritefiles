'use strict';

var grunt = require('grunt');

exports.sprites = {
	empty: function(test) {
		test.expect(1);

		var image = grunt.file.read('tmp/idontexist.png');
		test.equal('', image, 'Empty sprite image is created');

		test.done();
	},
	compact: function(test) {
		test.expect(2);

		test.ok(grunt.file.exists('tmp/compact.png'), 'file is created with compact input');

		var image = grunt.file.read('tmp/compact.png');
		test.equals('PNG', image.substring(1, 4), 'sprite image is PNG');

		test.done();
	},
	filesObject: function(test) {
		test.expect(2);

		test.ok(grunt.file.exists('tmp/filesObject1.png'), 'first file is created with object input');
		test.ok(grunt.file.exists('tmp/filesObject2.png'), 'second file is created with object input');

		test.done();
	},
	filesArray: function(test) {
		test.expect(3);

		test.ok(grunt.file.exists('tmp/array1.png'), 'first file is created with array input');
		test.ok(grunt.file.exists('tmp/array2.png'), 'second file is created with array input');
		test.ok(grunt.file.exists('tmp/array3.png'), 'third file is created with array input');

		test.done();
	},
	filesOptions: function(test) {
		test.expect(1);

		var image = grunt.file.read('tmp/filesOptions');
		test.equals('JFIF', image.substring(6, 10), 'sprite image is overridden JPG');

		test.done();
	},
	processor: function(test) {
		test.expect(3);

		var expected = grunt.file.read('test/expected/css.json');
		var got = grunt.file.read('tmp/css.json');
		test.equals(expected, got, 'CSS file correct');

		expected = grunt.file.read('test/expected/css.style');
		got = grunt.file.read('tmp/css.style');
		test.equals(expected, got, 'Stylus file correct (with processor options)');

		expected = grunt.file.read('test/expected/css.less');
		got = grunt.file.read('tmp/css.less');
		test.equals(expected, got, 'LESS file correct');

		test.done();
	}
};
