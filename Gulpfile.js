let gulp = require("gulp");
let source = require("vinyl-source-stream");
let browserify = require("browserify");
let watchify = require("watchify");
let reactify = require("reactify");
let nodemon = require("gulp-nodemon");
let uglify = require("gulp-uglify");
let babelify = require("babelify");
let buffer = require("vinyl-buffer");

gulp.task("browserify", scripts).task("serve", serve);

function scripts() {
  let bundler = browserify({
    entries: ["./client/components/app.js"],
    transform: babelify.configure({ presets: ["react", "es2015"] }),
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
  });
  let watcher = watchify(bundler);

  return (
    watcher
      .on("update", function() {
        let updateStart = Date.now();
        console.log("Updating!");
        watcher
          .bundle()
          .on("error", function(err) {
            console.log("Error with compiling components", err.message);
          })
          .pipe(source("bundle.js"))
          // .pipe(buffer())
          // .pipe(uglify())
          .pipe(gulp.dest("./client/build/"));
        console.log("Updated!", Date.now() - updateStart + "ms");
      })
      // Create the initial bundle when starting the task
      .bundle()
      .on("error", function(err) {
        console.log("Error with compiling components", err.message);
      })
      .pipe(source("bundle.js"))
      // .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest("./client/build/"))
  );
}

function serve() {
  nodemon({
    script: "./server/server.js",
  });
}

gulp.task("default", ["browserify", "serve"]);
