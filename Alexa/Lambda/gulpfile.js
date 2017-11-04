var gulp = require('gulp')
var clean = require('gulp-clean')
var zip = require('gulp-zip')
var runSequence = require('run-sequence');

gulp.task('default', function () {
   runSequence(
      'clean',
      'zip',
      'watch'
   )
})

gulp.task('clean', function () {
   return gulp.src('./../lambda.zip', { read: false })
      .pipe(clean({ force: true }))
})

gulp.task('zip', function () {
   gulp.src('./src/*')
      .pipe(zip('lambda.zip'))
      .pipe(gulp.dest('./'))
})

gulp.task('watch', function () {
   gulp.watch('./src/*', ['default'])
})