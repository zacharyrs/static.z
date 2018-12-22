const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')

const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV == 'development'

const mdImages = require('./scripts/renderer.js').mdImages
const site = require('./scripts/loadSite.js')(path.resolve('./src'), dev)

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    ...site.templates.reduce(function(map, obj) {
      map[obj] = './src/base/templates/' + obj + '.js'
      return map
    }, {}),
    ...(dev ? { serve: 'webpack-plugin-serve/client' } : {}),
  },
  output: {
    path: __dirname + (dev ? '/dist' : '/build'),
    filename: dev ? '[name].[hash].js' : '[name].[contenthash].js',
  },
  devtool: dev ? 'source-map' : 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve('./scripts/sqip-loader/sqip-loader.js'),
            options: {
              numberOfPrimitives: 20,
              skipPreviewIfBase64: true,
            },
          },
          {
            loader: 'url-loader',
            options: {
              fallback: {
                loader: 'responsive-loader',
                options: {
                  sizes: [300, 600, 1200, 2000],
                  name: 'images/[name]-[hash]-[width].[ext]',
                  format: 'png',
                  adapter: require('responsive-loader/sharp'),
                },
              },
              limit: 40960,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
            },
          },
          {
            loader: 'prettier-loader',
            options: {
              parser: 'babylon',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.sss/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].css',
            },
          },
          'extract-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
          {
            loader: 'prettier-loader',
            options: {
              parser: 'css',
            },
          },
        ],
      },
      {
        test: /\.md$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
            },
          },
          {
            loader: 'markdown-it-loader',
            options: {
              typographer: true,
              use: [mdImages],
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: ['pug-loader'],
      },
    ],
  },
  watch: dev,
  plugins: [
    new WebpackBar(),
    ...(dev
      ? [
          new Serve({
            static: 'dist',
          }),
        ]
      : []),
    ...(dev ? [new CleanWebpackPlugin('./dist')] : []),
    ...site.pages.map(p => new HtmlWebpackPlugin(p)),
  ],
}
