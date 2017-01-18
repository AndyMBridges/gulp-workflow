var gulp 		= require('gulp'),
	gutil 		= require('gulp-util'),
	jshint 		= require('gulp-jshint'),
	cssnano     = require('gulp-cssnano'),
	sass 		= require('gulp-sass'),
	concat 		= require('gulp-concat'),
	sourcemaps 	= require('gulp-sourcemaps'),
	uglify     	= require('gulp-uglify'),
	bs 			= require('browser-sync').create();

/* input files */
input  = {
  'sass': 'scss/**/*.scss',
  'javascript': 'js/**/*.js'
},

/* output files */
output = {
  'sass': 'dist/css',
  'javascript': 'dist/js'
};

/* set supported versions for autoprefixer */
var supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
];

/* set up browser-sync */
/* view proxy options here - https://browsersync.io/docs/options/#option-proxy */
gulp.task('browser-sync', ['sass'], function() {
	bs.init({
	    server: {
	        baseDir: "./"
	    }
	});
});

/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* concat javascript files, minify if --type=production */
gulp.task('build-js', function() {
  return gulp.src(input.javascript)
    .pipe(sourcemaps.init())
      .pipe(concat('script.js'))
      //only uglify if gulp is ran with '--type=production'
      //.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
	  .pipe(uglify()) // uglify the javascript by default
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.javascript))
	.pipe(bs.reload({stream: true}));
});

/* compile sass */
gulp.task('sass', function () {
    return gulp.src(input.sass)
	.pipe(sass())
	.pipe(cssnano({
		autoprefixer: {browsers: supported, add: true}
	}))
	.pipe(gulp.dest(output.sass))
	.pipe(bs.reload({stream: true}));
});

gulp.task('watch', ['browser-sync'], function () {
	gulp.watch(input.javascript, ['jshint', 'build-js']);
    gulp.watch(input.sass, ['sass']);
    gulp.watch("*.html").on('change', bs.reload);
});
