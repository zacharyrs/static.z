const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')

const fs = require('fs')
const path = require('path')
const marked = require('marked')

const data = require('./src/content/data.json')
const dev = process.env.NODE_ENV == 'development'

const pages = ['src/content/pages/index/index', 'src/content/pages/general/a']

var renderer = new marked.Renderer()
renderer.image = (href, title, text) => {
  return `
  <div class="image-wrapper">
    <img class="image-preview" src="\${require('./${href}').preview}" alt="${text}" ${
    title == null ? '' : ' title="' + title + '"'
  }>
    <img class="image-main" onload="this.classList.add('image-loaded')" src="\${require('./${href}').src}" srcset="\${require('./${href}').srcSet}" alt="${text}" ${
    title == null ? '' : ' title="' + title + '"'
  }>
  `
}

const makeHtmlConfig = file => {
  let page = path.basename(file)
  let template = path.basename(path.dirname(file))

  let meta = require('./' + file + '/' + page + '.json')
  let md = file + '/' + page + '.md'

  return {
    template: 'pug-loader!./src/base/templates/' + template + '.pug',
    chunks: [template, ...(dev ? ['serve'] : [])],
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
    ...(dev ? { serve: 'webpack-plugin-serve/client' } : {}),
  },
  output: {
    path: __dirname + '/dist',
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
            loader: path.resolve('./scripts/sqip-loader.js'),
            options: {
              numberOfPrimitives: 20,
              skipPreviewIfBase64: true,
            },
          },
          {
            loader: 'responsive-loader',
            options: {
              sizes: [300, 600, 1200, 2000],
              quality: 85,
              outputPath: 'images/',
              format: 'png',
              adapter: require('responsive-loader/sharp'),
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 40960,
            },
          },
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     disable: dev,
          //   },
          // },
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
              name: dev ? '[name].[hash].css' : '[name].[contenthash].css',
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
            loader: 'markdown-loader',
            options: { renderer },
          },
        ],
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
    new CleanWebpackPlugin('./dist'),
    ...pages.map(p => new HtmlWebpackPlugin(makeHtmlConfig(p))),
  ],
}
