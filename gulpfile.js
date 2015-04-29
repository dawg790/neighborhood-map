var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'),
// POSTCSS preprocessing
  autoprefixer = require('gulp-autoprefixer'),
// Image optimization variables
  imagemin = require('gulp-imagemin');
// var imageminJpegtran = require('imagemin-jpegtran');
// var imageminOptipng = require('imagemin-optipng');

// paths to various files
var paths = {
	components: ["src/components/jquery/dist/jquery.min.js", "src/components/knockout/dist/knockout.js"]
};

gulp.task('default', function() {
  console.log("Good job Nick, you got Gulp installed and working in this directory.");
});

// Move Bower Components to dist folders
gulp.task('bower-to-dist', function() {
	return gulp.src(paths.components)
	  .pipe(gulp.dest('dist/js'));
});

// task to minify my JS, and move from src/js to dist/js
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete!' }));
});

// task to minify CSS, and move from src/css to dist/css
gulp.task('styles', function() {
  return gulp.src('src/css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete!' }));
});

// TODO: Add this to our styles task - but get it working properly.
gulp.task('prefix', function () {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'));
});

// task to minify HTML and move from src/index.html to dist/index.html
gulp.task('content', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: 'HTML min task complete!'}));
});

// optimize images and move to dist/images
gulp.task('images', function() {
	return gulp.src('src/images/*')
		.pipe(imagemin({optimizationLevel: 5, progressive: true}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function() {
  gulp.watch('src/css/*.css', ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/*.html', ['content']);
  gulp.watch('src/*.*', ['images']);
});

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}