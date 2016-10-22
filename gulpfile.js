var gulp = require('gulp');
var del = require('del');
var path = require('path');
var extname = require('gulp-extname');
var assemble = require('assemble');
var helpers = require('handlebars-helpers')();
var prettify = require('gulp-html-prettify');
var htmllint = require('gulp-htmllint')
var gutil = require('gulp-util');
var app = assemble();
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');


/* ================ ASEMBLE ================ */
gulp.task('assemble:load', function(cb) {
	app.partials('templates/partials/*.hbs');
	app.layouts('templates/layouts/*.hbs');
	app.pages('templates/pages/*.hbs');
	app.data(require('./templates/data.json'));
	app.helpers(helpers);
	cb();
});

gulp.task('assemble:htmllint', function() {
	return gulp.src(['templates/partials/*.hbs', 'templates/layouts/*.hbs', 'templates/pages/*.hbs'])
		.pipe(htmllint({
			"rules": {
				"attr-bans": [],
				"tag-bans": false,
				"attr-name-style": false,
				"line-end-style": false,
				"id-class-style": false,
				"attr-req-value": "",
				"img-req-alt": false,
				"tag-close": false,
				"tag-self-close": false
			}
		}, function htmllintReporter(filepath, issues) {
			if (issues.length > 0) {
				issues.forEach(function (issue) {
					console.log('=======================================');
					console.log(path.basename(filepath));
					console.log(issue);
				});
		 
				process.exitCode = 1;
			}
		}));
});

gulp.task('assemble', ['assemble:load', 'assemble:htmllint'], function() {
	return app.toStream('pages')
		.pipe(plumber())
		.pipe(app.renderFile())
		.pipe(extname())
		.pipe(prettify({indent_char: '	', indent_size: 1}))
		.pipe(app.dest('dist'));
});

/* ================ COMPASS ================ */
gulp.task('compass', function() {
	gulp.src('./sass/**/*.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: './config.rb',
			css: './dist/css',
			sass: 'sass'
		}))
        .pipe(autoprefixer({
            browsers: ['last 25 version', 'IE 9'],
            flexbox: true,
            cascade: false
        }))
		.pipe(gulp.dest('dist/css'));
});

/* ================ SCRIPTS ================ */
gulp.task('scripts:module', function() {
	return gulp.src(['./js/modules/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))

		.pipe(addsrc.prepend('js/main-before.js'))
		.pipe(addsrc.prepend('js/vendors.js'))
		.pipe(addsrc.append('js/main-after.js'))

		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts:vendors', function() {
	return gulp.src(['./js/vendors/*.js'])
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest('./js/'));
});

gulp.task('scripts:all', function(done) {
	runSequence('scripts:vendors', 'scripts:module', function() {
		done();
	});
});

/* ================ Iconfont ================ */
gulp.task('iconFont', function(){
	return gulp.src(['assets/svg/*.svg'])
		.pipe(iconfontCss({
			fontName: 'icons',
			path: 'sass/_icons-pattern.scss',
			targetPath: '../../../sass/_icons.scss',
			fontPath: '../fonts/icons/',
			cssClass: 'ico'
		}))
		.pipe(iconfont({
			fontName: 'icons',
			prependUnicode: true,
			formats: ['ttf', 'eot', 'woff'],
			timestamp: runTimestamp,
			fontPath: '../fonts/',
			className: 'ico'
		}))
		.on('glyphs', function(glyphs, options) {
			// CSS templating, e.g. 
			// console.log(glyphs, options);
		})
		.pipe(gulp.dest('dist/fonts/icons'));
});

/* ================ WATCH ================ */
gulp.task('watch', function () {
	gulp.watch('sass/**/*.scss', ['compass']);
	gulp.watch('assets/svg/*.svg', ['iconFont']);

	gulp.watch(['js/modules/*.js', 'js/main-before.js', 'js/main-after.js'], ['scripts:module']);
	gulp.watch('js/vendors/*.js', ['scripts:all']);

	gulp.watch([
		'templates/partials/*.hbs',
		'templates/layouts/*.hbs',
		'templates/data.json',
	], ['assemble']);

	var watcher = gulp.watch('templates/pages/*.hbs', ['assemble']);

	watcher.on('change', function (event) {
		if (event.type === 'deleted') {
			var fileName = path.basename(event.path);
			var destFilePath = path.resolve("dist", fileName);
			del(destFilePath.replace(".hbs", ".html"));
		}
	});
});

/* ================ SERVER ================ */
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});

	gulp.watch("./dist/**/*").on("change", browserSync.reload);
});

/* ================ DEFAULT ================ */
gulp.task('default', ['browser-sync', 'watch']);
// gulp.task('default', ['watch']);