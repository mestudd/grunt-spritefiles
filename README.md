grunt-spritefiles
=================
Grunt library for using [spritesmith](https://github.com/Ensighten/spritesmith), a spritesheet and CSS pre-processor utility.

Synopsis
--------
[Spritesmith](https://github.com/Ensighten/spritesmith) accepts a list of images, stiches them together, and returns that image along with a coordinate map of where each image is located and its dimensions.

[Grunt](https://github.com/gruntjs/grunt/) is a node.js based CLI build tool.

[json2css](https://github.com/twolfson/json2css) converts the output from [Spritesmith](https://github.com/Ensighten/spritesmith) and generates variables and helper functions for hooking into inside of your CSS pre-processor.

When you combine all three of these, you get a grunt plugin that makes maintaining sprites a breeze.

Getting Started
---------------
Install this grunt plugin next to your project's [grunt.js gruntfile](https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md) with: `npm install grunt-spritefiles`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-spritefiles');
```

Requirements
------------
Spritesmith supports multiple sprite engines however all of the current engines require external software to be installed. See [spritesmith](https://github.com/Ensighten/spritesmith) for instructions.

Why Use This Task
-----------------
Short answer: you probably don't. This task is mostly a copy of [grunt-spritesmith](https://github.com/Ensighten/grunt-spritesmith), and you probably want to use it instead.

This module was written for a large, complex, existing product that needed to programatically generate sprite-creation tasks and run custom processing for sprites without changing old workflow. It uses the typical grunt src/dest/files attributes to generate multiple sprites per task. The spritesmith results are passed to a function to allow any customised processing.

Usage
-----
```js
// Load package if using extra functions from it
var sprite = require('./src/grunt-spritefiles.js');

// Provide a custom processing function
var customSprites = function(grunt, that, sprite, result) {
  // grunt: Grunt object, as available to task
  // that: this object from task
  // sprite: grunt files object for sprite
  // result: spritesmith result object
  grunt.verbose.writeflags(sprite, 'Files');
  grunt.verbose.writeflags(result.coordinates, 'Sprite coordinates');
};

grunt.initConfig({
  'sprite': {
    'all': {
      // Uses standard grunt src/dest/files attributes for building sprite image
      'files': [
        { dest: 'images/sprite.png', src: ['images/sprites/*.png'] },
        { dest: 'images/sprite.png', src: ['images/sprites/*.png'],
          // Processor function to run for each sprite
          processor: sprite.cssFile( // write CSS file (matches grunt-spritesmith)
            'css/sprite.json',  // css file location
            {
              // OPTIONAL: Specify CSS format (inferred from file's extension by default)
                  // (stylus, scss, sass, less, json)
              'cssFormat': 'json',

              // OPTIONAL: Manual override for imgPath specified in CSS
              'imgPath': '../sprite.png'
            })
        },
        'options': {
          // OPTIONAL: Specify algorithm (top-down, left-right, diagonal [\ format],
              // alt-diagonal [/ format], binary-tree [best packing])
          'algorithm': 'alt-diagonal',

          // OPTIONAL: Specify engine (auto, canvas, gm)
          'engine': 'canvas',

          // OPTIONAL: Specify img options
          'imgOpts': {
             // Format of the image (inferred from destImg' extension by default) (jpg, png)
             'format': 'png',

             // Quality of image (gm only)
             'quality': 90
          }
        }
      ]
    },
    'all': {
      dest: 'images/custom.png',
      src: ['images/*.gif'],
      processor: customSprites
    }
  }
});
```

Contributing
------------
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt/) and test via `npm test`.

### Algorithms
Algorithms are maintained via [twolfson/layout](https://github.com/twolfson/layout). If you would like to add one, please submit it via a pull request.

### Engines and image options
Engines and image options are maintained via [Ensighten/spritesmith](https://github.com/Ensighten/spritesmith). If you would like to add one, please submit it via a pull request.

### CSS formats
CSS formats are maintained via [twolfson/json2css](https://github.com/twolfson/json2css). If you would like to add one, please submit it via a pull request.

License
-------
Copyright (c) 2012 Ensighten
Copyright (c) 2013 Recognia Inc
Licensed under the MIT license.
