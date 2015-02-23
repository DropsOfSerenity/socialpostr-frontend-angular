(function() {
  'use strict';

  var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    del = require('del'),
    webserver = require('gulp-webserver');

  var paths = {
    temp: 'temp',
    tempVendor: 'temp/vendor',
    tempIndex: 'temp/index.html',

    index: 'app/index.html',
    appSrc: ['app/**/*', '!app/index.html'],
    bowerSrc: 'bower_components/**/*'
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
    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));
    console.log(tempVendors);
    var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));

    return gulp.src(paths.index)
      .pipe(gulp.dest(paths.temp))
      .pipe(inject(tempVendors, {
        relative: true,
        name: 'vendorInject'
      }))
      .pipe(inject(appFiles, {
        relative: true,
      }))
      .pipe(gulp.dest(paths.temp));
  });

  // gulp.task('vendorScripts', function() {
  //   var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));
  //   return gulp.src(paths.index)
  //     .pipe(gulp.dest(paths.temp))
  //     .pipe(inject(tempVendors, {
  //       relative: true,
  //       name: 'vendorInject'
  //     }))
  //     .pipe(gulp.dest(paths.temp));
  // });
  //
  // gulp.task('scripts', function() {
  //   var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));
  //
  //   return gulp.src(paths.index)
  //     .pipe(gulp.dest(paths.temp))
  //     .pipe(inject(appFiles, {
  //       relative: true
  //     }))
  //     .pipe(gulp.dest(paths.temp));
  // });

  gulp.task('clean', function() {
    del([paths.temp]);
  });

}());
