const path = require('path');
const webpack = require('webpack');
const ENV = process.env['NODE_ENV'];
const mode = ENV || 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyWebpackPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const childProces = require('child_process');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode,
  entry: {
    main: './src/app.ts',
  },
  devtool: ENV === 'development' ? 'inline-source-map' : 'cheap-source-map',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@Custom': path.resolve(__dirname, './src/custom'),
      '@Common': path.resolve(__dirname, './src/common'),
      '@images': path.resolve(__dirname, './src/images'),
    },
  },
  stats: 'errors-only',
  devServer: {
    hot: true,
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ENV === 'development' ? 'style-loader' : MinifyWebpackPlugin.loader, 'css-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './src/images', to: './images' }],
    }),
    new webpack.BannerPlugin({
      banner: `
      Build date: ${new Date().toLocaleString()}
      Commit Version: ${childProces.execSync('git rev-parse --short HEAD')}
      Author: ${childProces.execSync('git config user.name')}
      email: ${childProces.execSync('git config user.email')}
      `,
    }),
    ...(ENV === 'development' ? [] : [new MinifyWebpackPlugin({ filename: '[name].css' })]),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({}),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        env: ENV === 'development' ? '(개발용)' : '',
      },
    }),
  ],
  optimization: {
    minimizer:
      ENV === 'development'
        ? []
        : [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                },
              },
            }),
          ],
  },
};
