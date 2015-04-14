var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  jshint = require('gulp-jshint'),
  jsmin = require('gulp-jsmin');

gulp.task('default', function() {
  console.log("Good job Nick, you got Gulp installed and working in this directory.");
});

// Need task to minify my JS, and move from src/js to dist/js
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Need task to minify CSS, and move from src/css to dist/css
gulp.task('styles', function() {
  return gulp.src('src/css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('watch', function() {
  gulp.watch('src/css/*.css', ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
});