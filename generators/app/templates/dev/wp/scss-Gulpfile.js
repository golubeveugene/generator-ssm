/*
	SSM Gulp boilerplate, apr. 2017
*/

/**********************************************************************
1. Load all Gulp dependency NPM packages listed in `package.json`
**********************************************************************/

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	$ = require('gulp-load-plugins')(),
	pug = require('gulp-pug'),
	gulp_watch_pug = require('gulp-watch-pug'),
	clean = require('gulp-contrib-clean'),
	copy = require('gulp-contrib-copy'),
	pkg = require('./package.json'),
	imagemin = require('gulp-imagemin');
	uglify = require('gulp-uglify');
	uglifycss = require('gulp-uglifycss');
	autoprefixer = require('gulp-autoprefixer');
	reload = browserSync.reload,
	gcmq = require('gulp-group-css-media-queries');
	copyhtml = require('ionic-gulp-html-copy');
	src = './src',
	dist = './dist',
	config = {
		htmlPath: dist,
		scssPath: src + '/scss',
		cssPath: dist + '/css',
		jsPathSrc: src + '/js',
		jsPathDest: dist + '/js',
		imgPathSrc: src + '/images',
		imgPathDest: dist
	};

gulp.task('images', function(){
    gulp.src([config.imgPathSrc + '**/*'])
        .pipe(imagemin())
        .pipe(gulp.dest(config.imgPathDest));
});
/**********************************************************************
3. Configure Gulp tasks
**********************************************************************/

/* Sass compile with sourcemap
-------------------------------------------------------------------- */

gulp.task('sass', function(){
	return gulp.src(config.scssPath + '/**/*.scss')
		.pipe($.sass({
			style: 'extended',
			sourcemap: false,
			errLogToConsole: true
		}))
	    .pipe(autoprefixer({
	        browsers: ['last 4 versions'],
	        cascade: false
	    }))
        .pipe(gcmq())
		.pipe(uglifycss({
			"maxLineLen": 1,
			"uglyComments": true
		}))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
});

/* Compile Pug templates
-------------------------------------------------------------------- */

gulp.task('pug', function buildHTML() {
	return gulp.src(src + '/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
});

gulp.task('html', function() {
	return copyhtml({
			src: src + '/*.html',
			dest: dist
		})
		.pipe(browserSync.stream());
});

/* Run a proxy server
-------------------------------------------------------------------- */

gulp.task('browser-sync', function() {
	browserSync.init({
	    notify: false,
		server: {
	        directory:true,
	        baseDir: ['dist']
		}
	});
});

/* Cleanup the Sass generated --sourcemap *.map.css files
-------------------------------------------------------------------- */

gulp.task('clean', function(){
	gulp.src([dist], {read: false}).pipe(clean());
});

/* Copy
-------------------------------------------------------------------- */

gulp.task('copy', function(){
	gulp.src([
		config.jsPathSrc + '**/*.js'
	])
	.pipe(copy())
	.pipe(gulp.dest(dist));
});

gulp.task('copyImage', function(){
	gulp.src([
		config.imgPathSrc + '**/*.*'
	])
	.pipe(copy())
	.pipe(gulp.dest(config.imgPathDest));
});

/**********************************************************************
4. Uglify tasks
**********************************************************************/

gulp.task('uglify', function () {
    gulp.src(config.jsPathSrc + '**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

/**********************************************************************
5. Registered Gulp tasks
**********************************************************************/

gulp.task('build', ['clean'], function(){
  gulp.start('pug');
  gulp.start('html');
  gulp.start('sass');
  gulp.start('copy');
  gulp.start('images');
  gulp.start('uglify');
});

gulp.task('serve', ['build', 'browser-sync'], function(){
  gulp.watch(config.cssPath + '/*.css').on('change', browserSync.reload);
  gulp.watch(src + '/*.pug', ['pug']);
  gulp.watch(src + '/*.html', ['html']);
  gulp.watch(dist + '/*.html').on('change', browserSync.reload);
    gulp.watch('src/images/**/*', ['copyImage']);
  gulp.watch(config.scssPath + '/**/*.scss', ['sass']).on('change', browserSync.reload);
});

gulp.task('done', ['build']);