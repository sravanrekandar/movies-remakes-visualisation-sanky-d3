const path = require('path')
const gulp = require('gulp')
const rename = require('gulp-rename')
const browserify = require('gulp-browserify')
const pump = require('pump')
const browserSync = require('browser-sync').create()

gulp.task('static-render', (cb) => {
  pump([
    gulp.src(path.resolve(__dirname, './docs/index.js')),
    browserify(),
    rename('static-render.bundle.js'),
    gulp.dest('docs/bundles'),
  ], cb)
})

gulp.task('client-side-render', (cb) => {
  pump([
    gulp.src(path.resolve(__dirname, './docs/client-side-render.index.js')),
    browserify(),
    rename('client-side-render.bundle.js'),
    gulp.dest('docs/bundles'),
  ], cb)
})

gulp.task('pre-render-chart', (cb) => {
  require('./prerenderChart/index.js')
  cb()
})

/* This task is not needed everytime. Because we don't always acquire data from wiki html
* We will keep this task free of any other connections
* If we are avoiding this task, We have to make sure docs/assets/movies.json available with the right data.
*/
gulp.task('generate-json-from-wiki-html', (cb) => {
  require('./data-generator/index.js')
  cb()
})


gulp.task('ui-render', ['static-render', 'client-side-render'])
gulp.task('build', ['pre-render-chart', 'ui-render'])


// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('ui-changes-watch', ['ui-render'], (cb) => {
  browserSync.reload()
  cb()
})
gulp.task('pre-render-changes-watch', ['pre-render-chart'], (cb) => {
  browserSync.reload()
  cb()
})
gulp.task('dev', ['build'], (cb) => {
  browserSync.init({
    server: {
      baseDir: './docs',
    },
  })
  gulp.watch('docs/*.js', ['ui-changes-watch'])
  gulp.watch('docs/isomorphic-js/*.js', ['pre-render-changes-watch', 'ui-changes-watch'])
  cb()
})

