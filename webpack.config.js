const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

const FileManagerPlugin = require('filemanager-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PugPlugin = require('pug-plugin');

const ABSOLUTE_SRC_DIR = path.resolve(__dirname, 'assets');
const REL_SRC_DIR = './assets';
const DIST_DIR = path.resolve(__dirname, 'dist');


module.exports = {
  mode: devMode,
  target: target,
  devtool: devtool,

  entry: {
    index: REL_SRC_DIR + '/pug/index.pug', // => dist/index.html
  },

  output: {
    path: DIST_DIR,
    publicPath: '',
    environment: {
      arrowFunction: false
    },
    clean: true
  },

  optimization: {

    minimize: mode === 'production',
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/i,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.pug$/i,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          'css-loader',
          // 'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(svg|ico|png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[path][name][ext]',
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[path][name][ext]',
        },
      },
    ],
  },

  plugins: [

    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: ABSOLUTE_SRC_DIR + '/static',
              destination: 'dist',
            },
          ],
        },
      },
    }),

    new PugPlugin({
      pretty: mode === 'development',  //код в выходном файле в читабельном виде
      css: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
      js: {
        filename: 'assets/js/[name].[contenthash:8].js',
        use: 'babel-loader',
      },
    }),
  ],

  devServer: {
    watchFiles: path.join(__dirname, 'dist'),
    port: 9000,
  },

};