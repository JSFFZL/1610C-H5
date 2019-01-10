var gulp = require('gulp');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
gulp.task('server',function(){
	return gulp.src('./')
	.pipe(server({
		port:9093,
		open:true,
		livereload:true,
// 		proxies:[
// 			{
// 				source:'',target:''
// 			},
// 		]
	}))
})

gulp.task('sass',function(){
	return gulp.src('./css/sass/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./css/sass/'))
})

gulp.task('watch',function(){
	return gulp.watch('./css/sass/*.scss',gulp.series('sass'))
})

gulp.task('dev', gulp.parallel('sass','server','watch'))