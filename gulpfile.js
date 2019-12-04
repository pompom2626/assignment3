const { src, dest ,watch ,parallel } = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();


function watcher () {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  })
  watch('./src/sass/*.scss', style)
  watch('./dist/*.html').on('change', browserSync.reload)
  watch('./src/js/*.js').on('change', browserSync.reload)
}

function style () {
  return src('./src/sass/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(cleanCss())
  .pipe(dest('dist/css'))
  .pipe(browserSync.stream())
}

function img () {
  return src('./src/img/**/*')
  .pipe(imagemin())
  .pipe(dest('dist/img'))
  .pipe(browserSync.stream())
  
}

function js () {
  return src('./src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./dist/js'))
  .pipe(browserSync.stream())
}

exports.js = js;
exports.img = img;
exports.style = style;
exports.watcher = watcher;

exports.default = parallel(watcher, style, js);