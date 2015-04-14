var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  jshint = require('gulp-jshint'),
  jsmin = require('gulp-jsmin'),
  htmlmin = require('gulp-htmlmin');

var imagemin = require('gulp-imagemin');
var pngquant = require('gulp-imagemin/node_modules/imagemin/node_modules/imagemin-pngquant');

gulp.task('default', function() {
  console.log("Good job Nick, you got Gulp installed and working in this directory.");
});

// task to minify my JS, and move from src/js to dist/js
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(jsmin())
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

// task to minify HTML and move from src/index.html to dist/index.html
gulp.task('content', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(notify({message: 'HTML min task complete!'}));
});

// optimize images and move to dist/images
gulp.task('images', function () {
  return gulp.src('src/images/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({message: 'Image Optimization task complete!'}));
});

gulp.task('watch', function() {
  gulp.watch('src/css/*.css', ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/*.html', ['content']);
});