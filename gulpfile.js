const { src, dest, parallel, series, watch } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
const clean = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');  
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const mozjpeg = require('imagemin-mozjpeg');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const livereload = require('gulp-livereload');
lr = require('tiny-lr'),
server = lr();

function styles() {
    return src('./src/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(clean())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

function img() {
    return src('./src/images/**/*')
        .pipe(imagemin([
         // pngquant({quality: [0.5, 0.5]}),
          mozjpeg({quality: 50})
        ]))
        .pipe(gulp.dest('./dist/imgs/'))
}

function js() {
    return src('./src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(minify())
        .pipe(rename('all.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
}

function html(){
  return gulp.src('./index.html')
        .pipe(gulp.dest('./dist'))
        .pipe(livereload(server))
}

exports.styles = styles;
exports.img = img;
exports.js = js;
exports.html = html;


exports.all = gulp.series(styles, js, img, html, function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

   gulp.watch('./src/css/**/*.scss', styles);
   gulp.watch('./src/js/*js', js);
   gulp.watch('./index.html' ,html).on('change', browserSync.reload);
});