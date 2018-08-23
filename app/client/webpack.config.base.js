const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distPath = path.resolve(__dirname, '../../public/dist');

const pathToClean = [distPath];

let config = {
  entry: path.resolve(__dirname, './index.tsx'),
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/dist',
    path: distPath
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  performance: { hints: false },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: 'file-loader',
        options: {
          outputPath: './fonts',
          publicPath: (path) => '/dist/fonts/' + path,
          name: '[name].[hash:8].[ext]'
        }
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              outputPath: './images',
              publicPath: (path) => '/dist/images/' + path,
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(pathToClean, {
      allowExternal: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../assets/html/template.html'),
      minify: true
    })
  ]
};

module.exports = {
  config
};
