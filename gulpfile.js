var gulp = require('gulp')
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')
var replace = require('gulp-replace')
var path = require('path')
var concat = require('gulp-concat')
var main = path.basename(require('./package.json').main)
require('babel/register')

gulp.task('build', function () {
  return gulp.src('{vendor/**/*.js,' + main + ',cli.js,lib/**/*.js}')
    .pipe(sourcemaps.init())
    // Ideally, this would use Webpack or Browserify, but for now we will just concat the files together.
      .pipe(concat('l-system.js'))
      .pipe(babel())
      .pipe(replace(/#!\/usr\/bin\/env babel-node/, '#!/usr/bin/env node'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist'))
})

gulp.task('test', function () {
  var mocha = require('gulp-mocha')

  return gulp.src(['test/setup/node.js', 'test/unit/*.js'], {
    read: false
  })
    .pipe(mocha())
})
