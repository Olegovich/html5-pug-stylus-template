'use strict';

const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminSvgo = require('imagemin-svgo'),
    svgSprite = require('gulp-svg-sprite'),
    del = require('del'),
    gulpIf = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps');
    // debug = require('gulp-debug');

// Check if is development build (for example: show sourcemaps only in development):
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

// Wrap gulp streams into fail-safe function for better error reporting. Original info:
// https://habr.com/ru/post/259225/, https://gist.github.com/just-boris/89ee7c1829e87e2db04c
function wrapPipe(taskFn) {
    return function(done) {
        let onSuccess = function() {
            done();
        };
        let onError = function(err) {
            done(err);
            // Ends the process in node.js
            process.exit();
        };
        let outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

gulp.task('pug', function buildHTML() {
    return gulp.src('src/templates/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('src'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('stylus', function () {
   return gulp.src('src/stylus/**/main.styl')
       //.pipe(debug({title: 'src'}))
       .pipe(gulpIf(isDev, sourcemaps.init()))
       .pipe(stylus())
       //.pipe(debug({title: 'stylus'}))
       .pipe(concat('styles.css'))
       //.pipe(debug({title: 'concat'}))
       .pipe(gulpIf(isDev, sourcemaps.write()))
       .pipe(gulp.dest('src/css'))
       .pipe(browserSync.stream());
});

// Static Server + watching pug/stylus files
gulp.task('serve', ['pug', 'stylus'], function() {
    browserSync.init({
        server: "src"
    });

    gulp.watch('src/templates/**/*.pug', ['pug']);
    gulp.watch("src/stylus/**/*.styl", ['stylus']);
});

gulp.task('libs-css', function() {
    return gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/swiper/dist/css/swiper.min.css'
    ])
        .pipe(concat('libs.min.css'))
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('libs-js', wrapPipe(function(success, error) {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/swiper/dist/js/swiper.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify().on('error', error))
        .pipe(gulp.dest('src/js'));
}));

gulp.task('jpeg-opt', () =>
    gulp.src('src/img/**/*.jpg')
        .pipe(imagemin([
            imageminMozjpeg({
                progressive: true,
                quality: 95
            })
        ]))
        .pipe(gulp.dest('src/img'))
);

gulp.task('png-opt', () =>
    gulp.src('src/img/**/*.png')
        .pipe(imagemin([
            imageminPngquant({
                quality: [0.85, 0.95]
            })
        ]))
        .pipe(gulp.dest('src/img'))
);

gulp.task('svg-opt', () =>
    gulp.src('src/img/icons/*.svg')
        .pipe(imagemin([
            imageminSvgo({
                convertColors: true,
            })]))
        .pipe(gulp.dest('src/img/icons'))
);

gulp.task('svg-sprite', () =>
    gulp.src('src/img/icons/*.svg')
        .pipe(svgSprite({
            mode: {
                symbol: { sprite: "../sprites/sprite.svg" }
            }
        }))
        .pipe(gulp.dest('src/img/icons'))
);

gulp.task('clean', function () {
    del.sync('dist');
});

gulp.task('default', ['serve', 'libs-css', 'libs-js', 'jpeg-opt', 'png-opt', 'svg-opt', 'svg-sprite'], function() {
});

gulp.task('build', ['clean', 'pug', 'stylus', 'libs-css', 'libs-js', 'jpeg-opt', 'png-opt', 'svg-opt', 'svg-sprite'], function() {
    let buildHtml = gulp.src([
        'src/*.html'
    ]).pipe(gulp.dest('dist'));

    let buildCss = gulp.src([
        'src/css/*.css'
    ]).pipe(gulp.dest('dist/css'));

    let buildJs = gulp.src('src/js/**/*').pipe(gulp.dest('dist/js'));

    let buildFonts = gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));

    let buildImgs = gulp.src('src/img/**/*').pipe(gulp.dest('dist/img'));

    let buildFiles = gulp.src([
        'src/*.txt',
        'src/*.php'
    ]).pipe(gulp.dest('dist'));
});