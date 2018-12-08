const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')

const fs = require('fs')
const path = require('path')
const marked = require('marked')
const matter = require('gray-matter')

const data = require('./src/content/data.json')

const pages = ['src/content/pages/index/index.md', 'src/content/pages/general/a.md']

const makeHtmlConfig = file => {
  page = matter(fs.readFileSync(file))

  return {
    template: 'pug-loader!./src/base/templates/' + path.basename(path.dirname(file)) + '.pug',
    chunks: [path.basename(path.dirname(file)), ...(process.env.NODE_ENV == 'development' ? ['serve'] : [])],
    cache: true,
    title: page.data.title,
    filename: path.basename(file, '.md') + '.html',
    meta: {
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      description: page.data.description,
    },
    bodyHTML: marked(page.content),

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
        test: /\.json/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'json-loader',
          },
          {
            loader: 'prettier-loader',
            options: {
              parser: 'json',
            },
          },
        ],
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
