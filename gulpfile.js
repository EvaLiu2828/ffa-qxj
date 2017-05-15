/**
 * Created by v-qizhongfang on 2015/8/31.
 */

var gulp = require('gulp'); //载入本地gulp模块


/**
 * 将项目相关的配置写在package.json中，详见package.json文件
 */
var pkg = require('./package.json');    //载入package.json
var configs = pkg['ffa-configs'];   //获取项目配置
var dirs = configs.directories; //获取目录配置


var plugins = require('gulp-load-plugins')();   //载入load-plugins插件，用于自动载入其他gulp插件。


/**
 * 编写文件的header信息，此信息构建后将写入每个文件的头部，应包括
 * 项目名称，项目版本号等相关信息
 */
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' */',
    ''].join('\n');


/**
 * 配置gulp的默认任务，在node环境下的命令行运行 gulp 就可以执行。
 *
 */
gulp.task('default', ['buildBassCSS', 'buildComponentCSS', 'buildFrameCSS'], function() {
    //默认任务
    console.log('构建完成');
});

/**
 * 配置gulp的默认任务，
 * 第一个参数为String， 任务名称。
 * 第二个参数为Array，前置任务——执行此任务前需要执行的任务。 上边的那个default任务就用了这个
 * 第三个参为Function, 表示此任务需要执行哪些操作。
 * PS: gulp默认异步执行如有同步需求需要使用promise或者在任务函数中返回文件流。。具体看官方文档。。
 */
gulp.task('buildBassCSS', function() {
    return gulp.src([
        dirs.src+'/css/base/reset.css',
        dirs.src+'/css/base/helper.css'])   //获取源文件，可单个，可数组
        //.pipe(plugins.sourcemaps.init())  //初始化sourcemap，调试用的东西，具体咋用问度娘，上线构建不需要这个。
        .pipe(plugins.concat("base.css"))   //使用concat插件
        .pipe(plugins.minifyCss())          //压缩css
        .pipe(plugins.header(banner, { pkg : pkg} ))    //将banner写入文件
        //.pipe(plugins.sourcemaps.write())             //写入sourcemap
        .pipe(gulp.dest(dirs.dist+'/css'));             //将结果输入到 dirs.dist+'/css' 目录
});


//构建component.css
gulp.task('buildComponentCSS', function() {
    return gulp.src(dirs.src+'/css/component/less/component.less')
        //.pipe(plugins.sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.minifyCss())
        .pipe(plugins.header(banner, { pkg : pkg} ))
        //.pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(dirs.dist+'/css'));
});

//frame.css
gulp.task('buildFrameCSS', function() {
    return gulp.src(dirs.src+'/css/page/frame/*.css')
        //.pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat("frame.css"))
        .pipe(plugins.minifyCss())
        .pipe(plugins.header(banner, { pkg : pkg} ))
        //.pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(dirs.dist+'/css'));
});