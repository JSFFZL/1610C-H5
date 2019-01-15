var gulp = require('gulp');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
gulp.task('server',function(){
	return gulp.src('./')
	.pipe(server({
		port:9095,
		open:true,
		livereload:true,
		proxies:[
			{
				source:'/bill/api/addBill',target:'http://localhost:3000/bill/api/addBill',
			},
			{
				source:'/clssIfy/api/classIfy',target:"http://localhost:3000/classIfy/api/classIfy"
			},
			{
				source:'/users/api/getUser',target:'http://localhost:3000/users/api/getUser'
			},
			{
				source:'/bill/api/getBillTimer',target:'http://localhost:3000/bill/api/getBillTimer'
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