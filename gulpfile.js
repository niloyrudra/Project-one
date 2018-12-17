
/**
 *  --Top Level Functions
 * =========================
 *  gulp.task - Define tasks
 *  gulp.src - Point to files to use
 *  gulp.dest - Points to the folder to output
 *  gulp.watch - wWatch files and folders for changes
 * 
 */

var gulp = require( 'gulp' );
var rename = require( 'gulp-rename' );
var sass = require( 'gulp-sass' );
var uglify = require( 'gulp-uglify' );
var autoprefixer = require( 'gulp-autoprefixer' );
var sourcemaps = require( 'gulp-sourcemaps' );
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

var browserify = require( 'browserify' );
var babelify = require( 'babelify' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );


var styleSRC = 'src/scss/style.scss';
var styleDIST = './assets/css';
var styleWatch = 'src/scss/**/*.scss';

var js = 'main.js';
var jsSRC = 'src/js/';
var jsDIST = './assets/js';
var jsWatch = 'src/js/**/*.js';
var jsFILES = [ js ];


//  STYLE COMPILING
gulp.task( 'style', function(done) {

    gulp.src( styleSRC )
        .pipe( sourcemaps.init() )
        .pipe( sass( {
            errorLogToConsole: true,
            outputStyle: 'compressed'
        } ) )
        .on( 'error', console.error.bind( console ) )
        .pipe( autoprefixer( { 
            browsers: [ 'last 2 versions' ],
            cascade: false
        } ) )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( styleDIST ) );
        done();

} );

//  SCRIPT COMPILING
gulp.task( 'js', function(done) {

    jsFILES.map( function( entry ) {

        return browserify({
            entries: [ jsSRC + entry ]
        })
        .transform( babelify, { presets: [ 'env' ] } )
        .bundle()
        .pipe( source( entry ) )
        .pipe( rename({ extname: '.min.js' }) )
        .pipe( buffer() )
        .pipe( sourcemaps.init({ loadMaps: true }) )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( jsDIST ) );

    } );
    done();

} );


//  Gulp Default Task
// gulp.task( 'default', [ 'style', 'js' ] );

//  Gulp WATCH Task
// gulp.task( 'watch', [ 'default' ], function() {

//     gulp.watch( styleWatch, [ 'style' ] );
//     gulp.watch( jsWatch, [ 'js' ] );

// } );


gulp.task( 'imagemin', (done) => {
    gulp.src( 'src/images/*' )
        .pipe( imagemin( [
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ] ) )
        .pipe( gulp.dest( 'assets/images' ) );
        
    done();
} );


// Minify js
// gulp.task('minify', function() {
//     gulp.src('src/js/booster.js')
//         .pipe(uglify())
//         .pipe(gulp.dest('assets'))
// });

// Compile Sass
// gulp.task( 'sass', function() {
//     gulp.src( 'src/sass/*.scss' )
//         .pipe( sass().on( 'error', sass.logError ) )
//         .pipe( gulp.dest( 'assets' ) )
// } );

// Scripts
// gulp.task( 'scripts', () => {
//     gulp.src( 'src/js/booster.js' )
//         .pipe( concat( 'booster_bundle.js' ) )
//         //.pipe( uglify() )
//         .pipe( gulp.dest( 'assets' ) );
// } );

// gulp.task( 'default', [ 'message', 'imagemin', 'sass', 'scripts' ] );

// gulp.task( 'watch', () => {
//     gulp.watch( 'src/js/booster.js', ['scripts'] );
//     gulp.watch( 'src/sass/*.scss', ['sass'] );
//     gulp.watch( 'src/img/*', ['imagemin'] );
// } );