const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
console.log( encodeURIComponent(process.env.type) );
const publicPath = process.env.NODE_ENV =='build'?"http://localhost:8080/":"http://localhost:9090/";
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
const webpack = require('webpack');
const CopyWebPackPlugin = require('copy-webpack-plugin');
module.exports = {
  devtool:'eval-source-map',
  //入口配置文件
  entry: {
    entry: './src/entry.js',
    entry2: './src/entry2.js',
    jquery:'jquery',
    vue:'vue'
  },
  //出口配置文件
  output: {
    //输出的目录
    path: path.resolve('dist'),
    //输出的文件名
    filename: '[name].js',
  },
  //模块： 例如读取 CSS 图片如何转变换 压缩
  module: {
    rules:[
      {
        test:/\.(jsx|js)$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:[
              "env","react"
            ]
          }
        },
        exclude:/node_modules/
      },
      {
        test:/\.css$/,
        use:ExtractTextPlugin.extract({
          fallback:"style-loader",//备份的时候，如果提取CSS失败则走style-loader
          use:[
            {loader:'css-loader',options:{importLoaders:1}},
            "postcss-loader"
          ],
          publicPath
        })
      },
      {
        test:/\.less$/,
        use:ExtractTextPlugin.extract({
          fallback:"style-loader",//备份的时候，如果提取CSS失败则走style-loader
          use:["css-loader","less-loader"],
          publicPath
        })
      },
      {
        test:/\.scss/,
        use:ExtractTextPlugin.extract({
          fallback:"style-loader",//备份的时候，如果提取CSS失败则走style-loader
          use:["css-loader","sass-loader"],
          publicPath
        })
      },
      {
        test:/\.(png|jpg|gif)/,
        use:[
          {
            loader:'url-loader',
            options:{
              limit:5,
              outputPath:'images/'
            }
          }
        ]
      },
      {
        test:/\.(htm|html)$/i,
        use:['html-withimg-loader']
      }
    ]
  },
  //插件，用于生产模式和各项功能
  plugins: [
    new CopyWebPackPlugin([
      {
        from:'./src/public',
        to:'./public'
      }
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      //name对应的是入口文件中的名字，我们起的是jQuery
      name:['jquery','vue'],
      //把文件打包到哪里,是一个路径
      filename:'assets/js/[name].js',
      //最小打包的文件模块数
      minChunks:2
    }),
    new webpack.BannerPlugin('教程'),
    //全局的引入
    new webpack.ProvidePlugin({
      $:"jquery"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      minify:{
        removeAttributeQuotes:true,
      },
      hash:true,
      template:'./src/index.html'
    }),
    //CSS文件存放的路径
    new ExtractTextPlugin("css/index.css"),
    new PurifyCSSPlugin({
      paths:glob.sync(path.join(__dirname,'src/*.html'))
    })
  ],
  //配置webpack开发服务功能
  devServer: {
    //设置服务的基本目录
    contentBase:path.resolve(__dirname,'dist'),
    //服务器的IP地址，可以使用IP也可以使用localhost
    host:'localhost',
    //服务器压缩是否开启
    compress:true,
    //配置服务端口号
    port:8080
  }
}