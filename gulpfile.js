/**
 * Created by 동준 on 2015-05-03.
 */
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    ngmin = require('gulp-ngmin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    csslint = require('gulp-csslint'),
    templateCache = require('gulp-angular-templatecache'),
    minifyHTML = require('gulp-minify-html');

// Styles
gulp.task('styles', function() {
    return gulp.src('public/src/css/*.css')
        .pipe(concatCss('johayo.css'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('public/dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('public/src/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(ngmin())
        .pipe(gulp.dest('public/dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
    return gulp.src('public/src/imgs/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('public/dist/imgs'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('angular-template', function(){
    gulp.src([
        'public/src/html/**/*.html',
        '!public/src/html/index.html'
    ])
        .pipe(templateCache())
        .pipe(gulp.dest('public/dist/template'))
        .pipe(notify({ message: 'template task complete' }));
});

// index.html 파일 복사
gulp.task('htmlify', function(){
    return gulp.src('public/src/html/index.html')
        .pipe(minifyHTML({}))
        .pipe(gulp.dest('public/dist'));
});

// Clean
gulp.task('clean', function(cb) {
    del(['public/dist'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'angular-template', 'scripts', 'images', 'htmlify');
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('public/src/css/*.css', ['styles']);

    // Watch .js files
    gulp.watch('public/src/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('public/src/imgs/**/*', ['images']);

    // Watch html files
    gulp.watch('public/src/html/**/*.html', ['angular-template']);

    // Watch html files
    gulp.watch('public/src/html/index.html', ['htmlify']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['public/dist/**']).on('change', livereload.changed);

});