const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')

const fs = require('fs')
const path = require('path')

const data = require('./src/content/data.json')

const pages = ['src/content/pages/index/index', 'src/content/pages/general/a']

const makeHtmlConfig = file => {
  let page = path.basename(file)
  let template = path.basename(path.dirname(file))

  let meta = require('./' + file + '/' + page + '.json')
  let md = file + '/' + page + '.md'

  return {
    template: 'pug-loader!./src/base/templates/' + template + '.pug',
    chunks: [template, ...(process.env.NODE_ENV == 'development' ? ['serve'] : [])],
    cache: true,
    title: meta.title,
    filename: page + '.html',
    meta: {
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      description: meta.description,
    },
    md: md,

    // favicon: './src/content/favicon.ico'
  }
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './src/base/templates/index.js',
    general: './src/base/templates/general.js',
    serve: 'webpack-plugin-serve/client',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[hash:8].js',
  },
  devtool: process.env.NODE_ENV == 'development' ? 'source-map' : 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'sqip-loader',
            options: {
              numberOfPrimitives: 20,
              skipPreviewIfBase64: true,
            },
          },
          {
            loader: 'url-loader',
            options: {
              fallback: 'responsive-loader',
              limit: 40960,
              quality: 85,
              outputPath: 'images/',
              format: 'png',
              adapter: require('responsive-loader/sharp'),
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV == 'development',
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
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              parser: 'sugarss',
              ident: 'postcss',
              plugins: loader => [require('postcss-preset-env')(), require('autoprefixer')(), require('cssnano')()],
            },
          },
          {
            loader: 'prettier-loader',
            options: {
              parser: 'postcss',
            },
          },
        ],
      },
      {
        test: /\.md$/,
        exclude: /node_modules/,
        use: ['html-loader', 'markdown-loader'],
      },
    ],
  },
  watch: process.env.NODE_ENV == 'development',
  plugins: [
    new WebpackBar(),
    new Serve({
      static: 'dist',
    }),
    new CleanWebpackPlugin('./dist'),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash:8].css',
    }),
    ...pages.map(p => new HtmlWebpackPlugin(makeHtmlConfig(p))),
  ],
}
