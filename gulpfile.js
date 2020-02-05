/*global require*/
"use strict";

const gulp = require('gulp');
const path = require('path');
const data = require('gulp-data');
const twig = require('gulp-twig'); // Decided to use twig, because already familiar with it
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const	plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const fs = require('fs');
const image = require('gulp-image');

/*
 * Directories here
 */
var paths = {
  build: './build/',
  scss: './client/scss/',
  data: './client/data/',
  js: './client/js/',
  images: './client/images/'
};

/**
 * Compile .twig files and pass in data from json file
 * matching file name. index.twig - index.twig.json
 */
gulp.task('twig', function () {
  return gulp.src(['./client/templates/*.twig'])
  // Stay live and reload on error
	.pipe(plumber({
		handleError: function (err) {
			console.log(err);
			this.emit('end');
		}
	}))
  // Load template pages json data
  .pipe(data(function (file) {
		return JSON.parse(fs.readFileSync(paths.data + path.basename(file.path) + '.json'));		
	}))
  .pipe(
    twig().on('error', function (err) {
        process.stderr.write(err.message + '\n');
        this.emit('end');
    })
  )
	.pipe(gulp.dest(paths.build));
});

/**
 * Recompile .twig files and live reload the browser
 */
gulp.task('rebuild', ['twig'], function () {
  // BrowserSync Reload
  browserSync.reload();
});

/**
 * Wait for twig, js and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'twig', 'js'], function () {
  browserSync({
    server: {
      baseDir: paths.build
    },
    notify: false,
    browser:"google chrome"
  });
});

/**
 * Build task compile & compress images
 */
gulp.task('image', function () {
  gulp.src(paths.images + '*')
    .pipe(image({
      pngquant: false,
      optipng: false,
      zopflipng: false,
      jpegRecompress: false,
      mozjpeg: false,
      guetzli: false,
      gifsicle: false,
      svgo: false
    }))
    .pipe(gulp.dest(paths.build + 'assets/images'));
});

/**
 * Compile .scss files into build css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
    return gulp.src(paths.scss + 'style.scss')
        .pipe(sourcemaps.init())
        // Stay live and reload on error
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(
            sass({
                includePaths: [paths.scss + 'vendors/'],
                outputStyle: 'compressed'
            }).on('error', function (err) {
                console.log(err.message);
                // sass.logError
                this.emit('end');
            })
        )
        .pipe(prefix(['last 15 versions','> 1%','ie 8','ie 7','iOS >= 9','Safari >= 9','Android >= 4.4','Opera >= 30'], {
            cascade: true
        }))	
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build + '/assets/css/'));
  });

/**
 * Compile script.js files into build assets js directory concat to script.min.js
 */
gulp.task('js', function(){
    return gulp.src(paths.js + '*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build +'assets/js'));
});

/**
 * Watch scss files for changes & recompile
 * Watch .twig files run twig-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
    // Script JS
    gulp.watch(paths.js + 'script.js', ['js', browserSync.reload]);
    // SCSS files or main.scss
    gulp.watch(paths.scss + '**/*.scss', ['sass', browserSync.reload]);
    // Assets Watch and copy to build in some file changes
    gulp.watch(['client/templates/**/*.twig','client/data/*.twig.json'], {cwd:'./'}, ['rebuild']);
});

// Build task compile sass and twig.
gulp.task('build', ['sass', 'twig']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the project site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch', 'image']);