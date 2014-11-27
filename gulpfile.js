// Copyright © 2014 authors, see package.json
//
// all rights reserved

var concat = require('gulp-concat');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

gulp.task('default', ['typescript']);

gulp.task('watch', ['typescript'], function() {
    gulp.watch('*.ts', ['typescript']);
});

gulp.task('typescript', function () {
    gulp.src(['*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript({
            declarationFiles: false,
            sortOutput: true
        })).js
        .pipe(concat('play.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));
});
