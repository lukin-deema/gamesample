var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require("del");
var path = require("path");
var multipipe = require("multipipe");
var wiredep = require('wiredep').stream;
var bowerFiles = require('bower-files')();
var browserSync = require("browser-sync");

var env = process.env.NODE_ENV || 'development';
var isDev =  env == 'development';
var path = {
	src: {
		styles: "frontend/styles/*.sass",
		assets: "frontend/assets/**",
		favicon: "frontend/favicon.ico"
	},
	build:{
		styles: 'public/assets/css',
		assets: 'public/assets',
		bowerFonts: 'public/assets/fonts',
		bowerJs: 'public/assets/lib',
		favicon: "public"
	}, 
	htmlReplace: {
		styles: [ 'assets/css/all.css' ],
		js: [ 'app/angularApp.js', 'app/controllers/startPageCtrl.js' ]
	}
}
gulp.task("clean", function(){

	return del('public');
})

gulp.task('sass', function() {
	return multipipe(
		gulp.src(path.src.styles),
		$.if(isDev,$.debug({title:'src'})),
		$.sourcemaps.init(),
		$.sass(),
		$.concat("all.css"),
		$.sourcemaps.write(),
		gulp.dest(path.build.styles)
	).on("error", $.notify.onError());
});
gulp.task('assets', function(){
	return multipipe(
		gulp.src(path.src.assets),
		$.newer(path.build.assets),
		gulp.dest(path.build.assets)
	).on("error", $.notify.onError());
})
gulp.task('favicon', function(){
	return multipipe(
		gulp.src(path.src.favicon),
		$.newer(path.build.favicon),
		gulp.dest(path.build.favicon)
	).on("error", $.notify.onError());
})

gulp.task('copyMyAngular', function(){
	return multipipe(
		gulp.src("frontend/app/**"),
		$.newer('public/app'),
		gulp.dest('public/app')
	).on("error", $.notify.onError());
})
gulp.task("copyBowerFonts",function(){
	return multipipe(
		gulp.src(bowerFiles.ext(['eot', 'woff', 'woff2', 'ttf', 'svg']).files),
    gulp.dest(path.build.bowerFonts)
	).on("error", $.notify.onError());
})
gulp.task('copyBowerJs', function(){
	return multipipe(
		gulp.src(bowerFiles.ext('js').files),
    gulp.dest(path.build.bowerJs)
	).on("error", $.notify.onError());
})
gulp.task('copyBowerCss', function(){
	return multipipe(
		gulp.src(bowerFiles.ext('css').files),
    gulp.dest(path.build.styles)
	).on("error", $.notify.onError());
})

gulp.task('processHtml', function () {
	return multipipe(
		gulp.src('frontend/index.html'),
		wiredep({src: "public/assets/",
			ignorePath: /[a-zA-Z0-9_\-\.]+\//g, 
			fileTypes: {
				html: {
					replace: {
						js: '<script src="assets/lib/{{filePath}}"></script>',
						css: '<link rel="stylesheet" href="assets/css/{{filePath}}" />',
					}
				}
			}
		}),
		$.htmlReplace({
			'css':{
				src: path.htmlReplace.styles,
				tpl:'<link rel="stylesheet" href="%s" />'
			},
			'js':{
				src: path.htmlReplace.js,
				tpl:'<script type="text/javascript" src="%s" charset="UTF-8"></script>'
			}
		}, { keepBlockTags: true }),
		gulp.dest('public')
	).on("error", $.notify.onError());
});

gulp.task("startWatch",function(){
	gulp.watch("frontend/styles/*.sass", gulp.series("sass"))
	gulp.watch("frontend/assets/**", gulp.series("assets"))
	gulp.watch("frontend/app/**", gulp.series("copyMyAngular"))
	gulp.watch("frontend/index.html", gulp.series("processHtml"))
});
gulp.task("startBrowserSync",function(){
	browserSync.init({
		proxy:{
			target:"localhost:2000"
		}
	})
	browserSync.watch("public/**/*.*").on("change", browserSync.reload)
})
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
	gulp.parallel("sass", "assets", "favicon", "copyBowerJs", "copyBowerCss", "copyMyAngular", "copyBowerFonts", "processHtml"),
	gulp.parallel("startServer", "startBrowserSync", "startWatch")
));