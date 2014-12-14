// Copyright © 2014 authors, see package.json
//
// all rights reserved

var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

gulp.task('default', ['typescript']);

gulp.task('watch', ['typescript'], function() {
    gulp.watch('*.ts', ['typescript']);
});

gulp.task('typescript', function () {
    gulp.src(['*.ts', 'spark-md5.min.js'])
        .pipe(sourcemaps.init())
        .pipe(gulpif(/\.ts$/, typescript({
                declarationFiles: false,
                sortOutput: true
            })))
        .pipe(concat('play.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));
});
