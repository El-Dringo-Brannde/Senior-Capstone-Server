var gulp = require('gulp')
var clean = require('gulp-clean')
var zip = require('gulp-zip')
var runSequence = require('run-sequence');

gulp.task('default', function() {
   runSequence(
      'clean',
      'move-node',
      'move-src',
      'zip',
      'clean-tmp',
   )
})

gulp.task('clean-tmp', function() {
   return gulp.src('./tmp', { read: false })
      .pipe(clean({ force: true }))
})

gulp.task('clean', function() {
   return gulp.src('./../lambda.zip', { read: false })
      .pipe(clean({ force: true }))
})

gulp.task('move-node', function() {
   return gulp.src(['./node_modules/**'])
      .pipe(gulp.dest('./tmp/node_modules'))
})

gulp.task('move-src', function() {
   return gulp.src(['./src/**'])
      .pipe(gulp.dest('./tmp/'))
})

gulp.task('zip', function() {
   return gulp.src('./tmp/**')
      .pipe(zip('lambda.zip'))
      .pipe(gulp.dest('./'))
})

gulp.watch('./src/**/*', ['default'])