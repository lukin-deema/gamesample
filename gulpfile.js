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
var concatApplicationJs = false;
var path = {
	src: {
		styles: "frontend/styles/*.sass",
		assets: "frontend/assets/**",
		favicon: "frontend/favicon.ico",
		socketIO: "bower_components/socket.io-client/**",
	},
	build:{
		styles: 'public/assets/css',
		assets: 'public/assets',
		bowerFonts: 'public/assets/fonts',
		bowerJs: 'public/assets/lib',
		public: "public",
		angularApp:'public/app',
	},
	htmlReplace: {
		styles: [ 'assets/css/all.css' ],
		jsSeparate: [
			'/socket.io/socket.io.js',
			'app/angularApp.js',
			'app/services/d3.js',
			'app/services/socketio.js',
			'app/controllers/startPageCtrl.js',
			'app/controllers/fieldPageCtrl.js',
			'app/directives/keyPress.js',
			'app/directives/d3Basic.js',
		],	
		jsConcat: [
			'public/assets/lib/socket.io.js',
			'app/application.js'
		]
	}
}

gulp.task("clean", function(){

	return del('public');
})

gulp.task('sass', function() {
	return multipipe(
		gulp.src(path.src.styles),
		$.newer(path.src.styles),
		$.debug({title:'src'}),
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
		$.debug({title:"assets"}),
		gulp.dest(path.build.assets)
	).on("error", $.notify.onError());
})
gulp.task('favicon', function(){
	return multipipe(
		gulp.src(path.src.favicon),
		$.newer(path.build.public),
		$.debug({title:"favicon"}),
		gulp.dest(path.build.public)
	).on("error", $.notify.onError());
})
gulp.task('copyMyAngularHTML', function(){
	return multipipe(
		gulp.src("frontend/app/**/*.html"),
		$.newer(path.build.angularApp),
		$.debug({title:"copyMyAngularHTML"}),
		gulp.dest(path.build.angularApp)
	).on("error", $.notify.onError());
})
gulp.task('copyMyAngularJS', function(){
	return multipipe(
		gulp.src("frontend/app/**/*.js"),
		$.if(concatApplicationJs, $.sourcemaps.init()),
		$.newer(path.build.angularApp),
		$.debug({title:"copyMyAngularJS"}),
		//$.uglify(),
		$.if(concatApplicationJs, $.concat("application.js")),
		$.if(concatApplicationJs, $.sourcemaps.write()),
		gulp.dest(path.build.angularApp)
	).on("error", $.notify.onError(function(err){
		return {title: "uglify", message: err}
	}));
})
gulp.task("copyBowerFonts",function(){
	return multipipe(
		gulp.src(bowerFiles.ext(['eot', 'woff', 'woff2', 'ttf', 'svg']).files),
		$.newer(path.build.bowerFonts),
		$.debug({title:"copyBowerFonts"}),
    gulp.dest(path.build.bowerFonts)
	).on("error", $.notify.onError());
})
gulp.task('copyBowerJs', function(){
	return multipipe(
		gulp.src(bowerFiles.ext('js').files),
		$.newer(path.build.bowerJs),
		$.debug({title:"copyBowerJs"}),
    gulp.dest(path.build.bowerJs)
	).on("error", $.notify.onError());
})
gulp.task('copyBowerCss', function(){
	return multipipe(
		gulp.src(bowerFiles.ext('css').files),
		$.newer(path.build.styles),
		$.debug({title:"copyBowerCss"}),
    gulp.dest(path.build.styles)
	).on("error", $.notify.onError());
})
gulp.task('processHtml', function () {
	return multipipe(
		gulp.src('frontend/index.html'),
		$.newer(path.build.public),
		$.debug({title:"processHtml"}),
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
		$.if(concatApplicationJs, 
			$.htmlReplace({
				'css':{
					src: path.htmlReplace.styles,
					tpl:'<link rel="stylesheet" href="%s" />'
				},
				'js':{
					src: path.htmlReplace.jsConcat,
					tpl:'<script type="text/javascript" src="%s" charset="UTF-8"></script>'
				}
			}, { keepBlockTags: true }),
			$.htmlReplace({
				'css':{
					src: path.htmlReplace.styles,
					tpl:'<link rel="stylesheet" href="%s" />'
				},
				'js':{
					src: path.htmlReplace.jsSeparate,
					tpl:'<script type="text/javascript" src="%s" charset="UTF-8"></script>'
				}
			}, { keepBlockTags: true })
		),
		gulp.dest(path.build.public)
	).on("error", $.notify.onError());
});
gulp.task('copySocketIO', function(){
	return multipipe(
		gulp.src(path.src.socketIO),
		$.newer(path.build.bowerJs),
		$.debug({title:"copySocketIO"}),
    gulp.dest('public/socket.io')
	).on("error", $.notify.onError());
})

gulp.task("startWatch",function(){
	gulp.watch("frontend/styles/*.sass", gulp.series("sass"))
	gulp.watch("frontend/assets/**", gulp.series("assets"))
	gulp.watch("frontend/app/**/*.html", gulp.series("copyMyAngularHTML"))
	gulp.watch("frontend/app/**/*.js", gulp.series("copyMyAngularJS"))
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

gulp.task("preparePublic", 
	gulp.parallel("sass", "assets", "favicon", "copyBowerJs", 
		"copyBowerCss", "copyMyAngularJS", "copyMyAngularHTML", 
		"copyBowerFonts", "processHtml"/*, "copySocketIO"*/)
)
gulp.task("startPublic",
	gulp.parallel("startServer", "startBrowserSync", "startWatch")
)

gulp.task('default', gulp.series(
	"clean",
	"preparePublic",
	"startPublic"
));