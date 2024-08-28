const del = require('del');
const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.json');
const distFolder = 'dist';

// build the source code
gulp.task('build:src', () => {
  const tsResult = tsProject
    .src()
    .pipe(sourcemaps.init({ identityMap: true, loadMaps: true }))
    .pipe(tsProject())
    .on('error', () => {});

  return tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest(distFolder));
});

// copy static assets from src
gulp.task('build:copy', () => {
  return gulp
    .src(path.join('src', `**/*.{json,html,csv,yaml,xml}`))
    .pipe(gulp.dest(`${distFolder}/`));
});

// clean the build folder
gulp.task('build:clean', () => {
  return del([distFolder]);
});

// trigger build task
gulp.task('build', gulp.series('build:clean', gulp.parallel('build:src', 'build:copy')));
gulp.task('build:server', gulp.series('build:clean', gulp.parallel('build:src', 'build:copy')));
