var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');

gulp.task('browserify', scripts)
    .task('serve', serve);

function scripts() {
  var bundler = browserify({
    entries: ['./client/app.jsx'],
    transform: babelify.configure({ presets: ['react', 'es2015'] }),
    debug: false,
    cache: {},
    packageCache: {},
    fullPaths: true
  });
  var watcher = watchify(bundler);

  return watcher
    .on('update', function() {
      var updateStart = Date.now();
      console.log('Updating!');
      watcher.bundle()
      .on('error', function(err) {
        console.log('Error with compiling components', err.message);
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./build/'));
      console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    // Create the initial bundle when starting the task
    .bundle()
    .on('error', function(err) {
      console.log('Error with compiling components', err.message);
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
}

function serve() {
  nodemon({
    script: './server/server.js',
  });
}


gulp.task('default', ['browserify', 'serve']);
