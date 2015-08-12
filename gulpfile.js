var gulp = require('gulp'),
	uglify = require('gulp-uglify');

gulp.task('js', function() {
	gulp.src('src/datetime.js')
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
	gulp.watch('src/datetime.js', ['js']);
})

gulp.task('default', ['js', 'watch']);