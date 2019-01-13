var gulp = require('gulp');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
gulp.task('server',function(){
	return gulp.src('./')
	.pipe(server({
		port:9093,
		open:true,
		livereload:true,
		proxies:[
			{
				source:'/bill/api/addBill',target:'http://localhost:3000/bill/api/addBill',
				source:'/classIfy/api/classIfy',target:"http://localhost:3000/classIfy/api/classIfy"
			}
		]
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