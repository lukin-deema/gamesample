var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require("del");
var path = require("path");
var multipipe = require("multipipe");

var env = process.env.NODE_ENV || 'development';
var isDev =  env == 'development';

gulp.task("clean", function(){

	return del('public');
})
gulp.task('sass', function() {
  return multipipe(
  	gulp.src("frontend/styles/*.sass"/*, { since:gulp.lastRun('sass')}*/),
		$.if(isDev,$.debug({title:'src'})),
		$.sourcemaps.init(),
		//$.remember('sass'),
		$.sass(),
		$.concat("all.css"),
		$.sourcemaps.write(),
		gulp.dest('public/assets/css')
	).on("error", $.notify.onError());
});
gulp.task('assets', function(){
	return gulp.src("frontend/assets/**")
		//.pipe($.cached('assets'))
		.pipe($.newer('public/assets'))
		.pipe(gulp.dest('public/assets'));
})
gulp.task('copyMyAngular', function(){
	return gulp.src("frontend/app/**")
		.pipe($.newer('public/app'))
		.pipe(gulp.dest('public/app'));
})
gulp.task("copyLibFonts",function(){
	return gulp.src("bower_components/bootstrap/fonts/*.*")
		.pipe($.newer('public'))
		.pipe(gulp.dest('public/assets/fonts'));	
})
gulp.task('copyLibJs', function(){
	return gulp.src(["bower_components/bootstrap/dist/js/bootstrap.js",
		"bower_components/angular-ui-router/release/angular-ui-router.js",
		"bower_components/angular/angular.js"])
		.pipe($.newer('public/assets/lib'))
		.pipe(gulp.dest('public/assets/lib'))///
})
gulp.task('copyLibCss', function(){
	return gulp.src(["bower_components/bootstrap/dist/css/bootstrap.css"])
		.pipe($.newer('public/assets/css'))
		.pipe(gulp.dest('public/assets/css'))///
})
gulp.task('copyIndexHtml', function(){
	return gulp.src(["frontend/index.html"])
		.pipe($.newer('public/assets/css'))
		.pipe(gulp.dest('public'))///
})
gulp.task("watch",function(){
	gulp.watch("frontend/styles/*.sass", gulp.series("sass"))
		.on("unlink",function(filename){
			$.remember.forget('sass', path.resolve(filename));
			//delete $.cached.caches.sass[path.resolve(filename)];
	})
	gulp.watch("frontend/assets/**", gulp.series("assets"))
		.on("unlink",function(filename){
			$.remember.forget('assets', path.resolve(filename));
			//delete $.cached.caches.assets[path.resolve(filename)];
	})
});

gulp.task('startServer', function() {
	$.nodemon({
    script: 'app.js',
    ext: 'html js',
    env: {
      'NODE_ENV': 'development'
    },
    ignore: [
      'node_modules/',
      'bower_components/',
      'logs/',
      'packages/*/*/public/assets/lib/',
      'packages/*/*/node_modules/',
      '.DS_Store', '**/.DS_Store',
      '.bower-*',
      '**/.bower-*',
      '**/tests'
    ],
    nodeArgs: ['--debug'],
    stdout: false
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if (/Mean app started/.test(chunk)) {
        setTimeout(function() {
          plugins.livereload.reload();
        }, 500);
      }
      process.stdout.write(chunk);
    });
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', gulp.series(
	"clean", 
	gulp.parallel("sass","assets","copyLibJs", "copyIndexHtml",
		"copyLibCss","copyMyAngular","copyLibFonts"),
	gulp.parallel("startServer", "watch")
));
