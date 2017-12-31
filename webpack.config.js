const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const publicPath = "http://localhost:8080/";
module.exports = {
  //入口配置文件
  entry: {
    entry: './src/entry.js',
    entry2: './src/entry2.js'
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
        test:/\.css$/,
        use:ExtractTextPlugin.extract({
          fallback:"style-loader",//备份的时候，如果提取CSS失败则走style-loader
          use:"css-loader",
          publicPath
        })
      },
      {
        test:/\.(png|jpg|gif)/,
        use:[
          {
            loader:'url-loader',
            options:{
              limit:5
            }
          }
        ]
      }
    ]
  },
  //插件，用于生产模式和各项功能
  plugins: [
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