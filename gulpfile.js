'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const stylus = require('gulp-stylus');
const render = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();

let paths = {
    styles: {
        src: "src/stylus/**/*.styl",
        dest: "static/css"
    },

    html: {
        src: "src/**/*.nj",
        dest: "./"
    },

    js: {
        src: "***/**/*.js",
        dest: "static/js"
    },

    imgs: {
        src: "src/**/*.jpg",
        dest: "static/img"
    },

    fonts: {
        src: "src/fonts",
        dest: "static/fonts"
    },

    public: {
        url: "./"
    }
}

function sync(done) {
    browserSync.init();
    done();
}

function moveFonts() {
    return (
        src(paths.fonts.src)
        .pipe(dest(paths.fonts.dest))
        .pipe(browserSync.stream())
    )
}

function stylusCompile() {
    return (
        src(paths.styles.src)
        .pipe(stylus({
            compress: true
        }))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream())
    )
}

function nunjucksCompile() {
    return (
        src(paths.html.src)
        .pipe(render({
            path: ['src/partials']
        }))
        .pipe(dest(paths.public.url))
        .pipe(browserSync.stream())
    )
}

function watchFonts() {
    watch(paths.fonts.src, moveFonts)
}

function watchHtml() {
    watch(paths.html.src, nunjucksCompile)
}

function watchstylus() {
    watch(paths.styles.src, stylusCompile)
}

exports.default = parallel(sync, watchstylus, watchHtml, watchFonts);