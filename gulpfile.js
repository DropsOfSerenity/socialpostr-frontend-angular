(function() {
  'use strict';

  var gulp          = require('gulp'),
    angularFilesort = require('gulp-angular-filesort'),
    mainBowerFiles  = require('main-bower-files'),
    inject          = require('gulp-inject'),
    del             = require('del'),
    minifyCss       = require('gulp-minify-css'),
    concat          = require('gulp-concat'),
    templateCache   = require('gulp-angular-templatecache'),
    uglify          = require('gulp-uglify'),
    webserver       = require('gulp-webserver');

  var paths = {
    temp: './temp',
    tempVendor: './temp/vendor',
    tempIndex: './temp/index.html',

    index: './app/index.html',
    appSrc: './app/**/*.js',
    appCss: './app/**/*.css',
    appHtml: './app/views/**/*.html',
    appFonts: './app/fonts/**/*.*',
    appImages: './app/images/**/*',
    bowerSrc: './bower_components/**/*'
  };

  gulp.task('default', ['watch']);

  gulp.task('watch', ['serve'], function() {
    gulp.watch(paths.appSrc, ['copyAll']);
    gulp.watch(paths.bowerSrc, ['copyAll']);
    gulp.watch(paths.index, ['copyAll']);
  });

  gulp.task('serve', ['copyAll'], function() {
    return gulp.src(paths.temp)
      .pipe(webserver({
        livereload: true,
        proxies: [{
          source: '/api',
          target: 'http://localhost:1337'
        }]
      }));
  });

  gulp.task('copyAll', function() {
    var vendorStream = gulp.src(mainBowerFiles())
      .pipe(gulp.dest(paths.tempVendor));

    var appStream = gulp.src(paths.appSrc)
      .pipe(angularFilesort())
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest(paths.temp));

    var cssStream = gulp.src(paths.appCss)
      .pipe(concat('app.min.css'))
      .pipe(minifyCss())
      .pipe(gulp.dest(paths.temp));

    var htmlStream = gulp.src(paths.appHtml)
      .pipe(templateCache({root: 'views/', module: 'app'}))
      .pipe(gulp.dest(paths.temp));

    fonts();
    images();

    return gulp.src(paths.index)
      .pipe(gulp.dest(paths.temp))
      .pipe(inject(appStream, {relative: true}))
      .pipe(inject(htmlStream, {name: 'templates', relative: true}))
      .pipe(inject(cssStream, {relative: true}))
      .pipe(inject(vendorStream, {name: 'vendorInject', relative: true}))
      .pipe(gulp.dest(paths.temp));
  });

  gulp.task('clean', function() {
    del([paths.temp]);
  });

  function fonts() {
    gulp.src(paths.appFonts)
      .pipe(gulp.dest(paths.temp + '/fonts'));
  }

  function images() {
    gulp.src(paths.appImages)
      .pipe(gulp.dest(paths.temp + '/images'));
  }

}());
