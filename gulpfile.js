var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

/* Configuration */

var jsSource =	[
					 './assets/scripts/*.ts'
					,'./assets/scripts/constants/*.ts' 
					,'./assets/scripts/controllers/*.ts'
					,'./assets/scripts/controllers/contest/forecasters/*.ts'
					,'./assets/scripts/controllers/contest/scorers/*.ts'
					,'./assets/scripts/controllers/contest/awards/*.ts'
					,'./assets/scripts/controllers/contest/points/*.ts'
					,'./assets/scripts/controllers/contest/l1/*.ts'
					,'./assets/scripts/controllers/contest/standings/*.ts'
					,'./assets/scripts/controllers/contest/teams/*.ts'
					, './assets/scripts/controllers/forecast/*.ts'
					,'./assets/scripts/services/*.ts'
					,'./assets/scripts/models/*.ts'
				];
var jsTarget = "app.js";

var jsVendors = ['./assets/scripts/vendors/*.js'];

var htmlSource = [
					 './assets/scripts/templates/*.html'
					,'./assets/scripts/templates/contest/forecasters/*.html'
					,'./assets/scripts/templates/contest/scorers/*.html'
					,'./assets/scripts/templates/contest/awards/*.html'
					,'./assets/scripts/templates/contest/points/*.html'
					,'./assets/scripts/templates/contest/l1/*.html'
					,'./assets/scripts/templates/contest/standings/*.html'
					,'./assets/scripts/templates/contest/teams/*.html'
					,'./assets/scripts/templates/forecast/*.html'
					,'./assets/scripts/templates/*.php'
				 ];

var php =	[
						 './assets/php/*.php'
						,'./assets/php/standings/*.php'
						,'./assets/php/forecast/*.php'
						,'./assets/php/contest/forecasters/*.php'
						,'./assets/php/contest/scorers/*.php'
						,'./assets/php/contest/awards/*.php'
						,'./assets/php/contest/points/*.php'
						,'./assets/php/contest/l1/*.php'
						,'./assets/php/contest/standings/*.php'
						,'./assets/php/contest/teams/*.php'
];

var cssSource =	[
					 './assets/styles/partials/*.less'
					,'./assets/styles/*.less'
];
var cssTarget = 'main.css';

var cssVendors = ['./assets/styles/vendors/*.css'];

var img =	[
					 './assets/images/*.png'
					,'./assets/images/*.jpg'
];

var distTarget = "./dist/";

/* Concat TypeScript files */
gulp.task('js', function() {
	return	gulp.src(jsSource)
			.pipe(sourcemaps.init())
			.pipe(ts({
				noImplicitAny: false,
				out: jsTarget
			}))
			.pipe(concat(jsTarget))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(distTarget))
			.pipe(livereload());
});

/* Copy vendors JS files */
gulp.task('jsVendors', function () {
	return gulp.src(jsVendors)
		.pipe(gulp.dest(distTarget))
		.pipe(livereload());
});

/* Copy HTML files */
gulp.task('html', function() {
	return	gulp.src(htmlSource)
			.pipe(gulp.dest(distTarget))
			.pipe(livereload());
});

/* Copy PHP files */
gulp.task('php', function() {
	return	gulp.src(php)
			.pipe(gulp.dest(distTarget))
			.pipe(livereload());
});

/* Concat LESS files */
gulp.task('less', function () {
	return	gulp.src(cssSource)
			.pipe(sourcemaps.init())
			.pipe(less())
			.pipe(concat(cssTarget))
			.pipe(sourcemaps.write(distTarget))
    	.pipe(gulp.dest(distTarget))
    	.pipe(livereload());
});

/* Copy CSS vendors files */
gulp.task('cssVendors', function () {
	return gulp.src(cssVendors)
		.pipe(gulp.dest(distTarget))
		.pipe(livereload());
});

/* Copy image files */
gulp.task('img', function () {
	return gulp.src(img)
		.pipe(gulp.dest(distTarget+'images'))
		.pipe(livereload());
});

/* watch */
gulp.task('watch', function() {
	livereload.listen();

	gulp.watch(jsSource, ['js']);
	gulp.watch(jsVendors, ['jsVendors']);
	gulp.watch(htmlSource, ['html']);
	gulp.watch(php, ['php']);
	gulp.watch(cssSource, ['less']);
	gulp.watch(cssVendors, ['cssVendors']);
	gulp.watch('index.html', function() {
		livereload.reload('./index.html');
	});
});

