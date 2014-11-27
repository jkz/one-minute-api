var concat = require('gulp-concat');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

gulp.task('default', function () {
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
