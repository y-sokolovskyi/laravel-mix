const mix = require('laravel-mix');
const del = require('del');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

del('dist');

mix.webpackConfig({
  stats: {
    children: true
  },
  devtool: 'inline-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/img',
          to: 'dist/img'
        }
      ]
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 70,
          progressive: true
        })
      ]
    })
  ]
});

mix.options({
  cssNano: {
    discardComments: {
      removeAll: true
    }
  },
  processCssUrls: false,
  postCss: [
    require('postcss-sort-media-queries')
  ],
  autoprefixer: {
    options: {
      browsers: [
        'last 6 versions'
      ]
    }
  },
  uglify: {
    comments: false
  }
})

mix.js('src/js/app.js', './dist/js');
mix.scripts([
  'node_modules/jquery/dist/jquery.min.js'
], './dist/js/libs.js');

mix.sass('src/scss/styles.scss', './src/css').styles([
  'node_modules/normalize.css/normalize.css',
  'src/css/styles.css'
], './dist/css/styles.css');

mix.copyDirectory('src/fonts', 'dist/fonts');
mix.copyDirectory('src/*.html', 'dist');
mix.copyDirectory('src/*.php', 'dist');

if (mix.inProduction()) {
  // mix.version();
} else {
  mix.browserSync({
    serveStatic: ['.', './dist/'],
    files: ['src/**/*']
  });
}
