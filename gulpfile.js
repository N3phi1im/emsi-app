var gulp          = require("gulp"),
    sass          = require("gulp-ruby-sass"),
    autoprefixer  = require("gulp-autoprefixer"),
    rename        = require("gulp-rename"),
    minifycss     = require("gulp-minify-css"),
    notify        = require("gulp-notify"),
    concat        = require("gulp-concat"),
    livereload    = require("gulp-livereload"),
    uglify        = require("gulp-uglify"),
    beautify      = require('gulp-beautify'),
    minifyHTML    = require('gulp-minify-html'),
    ngAnnotate    = require('gulp-ng-annotate');

gulp.task('styles', function(){
	return sass('./src/sass/**/*', { style: 'expanded' })
	.pipe(autoprefixer("last 2 versions"))
	.pipe(gulp.dest('./dist/css/'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(minifycss())
	.pipe(gulp.dest('./dist/css/'))
	.pipe(notify({message:"SCSS Compiled"}));
});

gulp.task('scripts', function() {
	return gulp.src("./src/javascript/**/*.js")
	.pipe(concat('jsBundle.js'))
	.pipe(beautify({indentSize: 4, indentChar : ' '}))
	.pipe(gulp.dest("./dist/js/"))
	.pipe(rename({suffix: ".min"}))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js/'))
	.pipe(notify({message:"Minified JS, And Bundled."}));
});

gulp.task('minify-html', function() {
	var opts = {
		conditionals: true
	};
	return gulp.src("./src/templates/**/*.html")
	.pipe(minifyHTML(opts))
	.pipe(gulp.dest('./dist/views'))
	.pipe(notify({message: "Minified HTML files."}));
});

gulp.task('watch', function(){
	livereload.listen({ start: true});
	gulp.watch(['./dist/**/*']).on('change', livereload.changed);
	gulp.watch('./src/templates/**/*.html', ['minify-html']);
	gulp.watch('./src/sass/**/*.scss', ['styles']);
	gulp.watch('./src/javascript/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'styles', 'minify-html']);
