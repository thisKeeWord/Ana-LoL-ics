const gulp = require("gulp");
const source = require("vinyl-source-stream");
const browserify = require("browserify");
const watchify = require("watchify");
const reactify = require("reactify");
const nodemon = require("gulp-nodemon");
const uglify = require("gulp-uglify");
const babelify = require("babelify");
const buffer = require("vinyl-buffer");

gulp.task("browserify", scripts).task("serve", serve);

function scripts() {
  const bundler = browserify({
    entries: ["./client/components/app.js"],
    transform: babelify.configure({ presets: ["@babel/react", "es2015"] }),
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
  });
  const watcher = watchify(bundler);

  return (
    watcher
      .on("update", function() {
        const updateStart = Date.now();
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
