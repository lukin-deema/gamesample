var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require("del");
var path = require("path");
var multipipe = require("multipipe");
var wiredep = require('wiredep').stream;
var bowerFiles = require('bower-files')();

var env = process.env.NODE_ENV || 'development';
var isDev =  env == 'development';
var path = {
	src: {
		styles: "frontend/styles/*.sass",
		assets: "frontend/assets/**",
	},
	build:{
		styles: 'public/assets/css',
		assets: 'public/assets',
		bowerFonts: 'public/assets/fonts',
		bowerJs: 'public/assets/lib',
	}, 
	htmlReplace: {
		styles: [ ],
		js: [ 'app/angularApp.js', 'app/controllers/appCtrl.js' ]
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
	return gulp.src(path.src.assets)
		.pipe($.newer(path.build.assets))
		.pipe(gulp.dest(path.build.assets));
})
gulp.task('copyMyAngular', function(){
	return gulp.src("frontend/app/**")
	.pipe($.newer('public/app'))
	.pipe(gulp.dest('public/app'))
})
gulp.task("copyBowerFonts",function(){
	return gulp.src(bowerFiles.ext(['eot', 'woff', 'woff2', 'ttf', 'svg']).files)
    .pipe(gulp.dest(path.build.bowerFonts));
})
gulp.task('copyBowerJs', function(){
	return gulp.src(bowerFiles.ext('js').files)
    .pipe(gulp.dest(path.build.bowerJs));
})
gulp.task('copyBowerCss', function(){
	return gulp.src(bowerFiles.ext('css').files)
    .pipe(gulp.dest(path.build.styles));
})

gulp.task('processHtml', function () {
	return gulp.src('frontend/index.html')
	.pipe(wiredep({src: "public/assets/",
		ignorePath: /[a-zA-Z_\-\.]+\//g,
		fileTypes: {
			html: {
				replace: {
					js: '<script src="assets/lib/{{filePath}}"></script>',
					css: '<link rel="stylesheet" href="assets/css/{{filePath}}" />',
				}
			}
		}
	}))
	.pipe($.htmlReplace({
		'css':{
			src: path.htmlReplace.styles,
			tpl:'<link rel="stylesheet" href="%s" />'
		},
		'js':{
			src: path.htmlReplace.js,
			tpl:'<script type="text/javascript" src="%s" charset="UTF-8"></script>'
		}
	}, { keepBlockTags: true }))
	.pipe(gulp.dest('public'));
});

gulp.task("watch",function(){
	gulp.watch("frontend/styles/*.sass", gulp.series("sass"))
	gulp.watch("frontend/assets/**", gulp.series("assets"))
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
	gulp.parallel("sass", "assets", "copyBowerJs", "copyBowerCss", "copyMyAngular", "copyBowerFonts","processHtml"),
	gulp.parallel("startServer", "watch")
));