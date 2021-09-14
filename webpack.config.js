const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    './index.js',
  ],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: [".js", ".jsx", ".es6", ".ts", ".tsx"],
    alias: {
      react: path.resolve('node_modules/react'),
      resources: path.resolve(__dirname, 'resources'),
      utils: path.resolve(__dirname, 'app/utils'),
      components: path.resolve(__dirname, 'components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.m?js|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", {"loose": true}],
              "@babel/plugin-proposal-function-sent",
              "@babel/plugin-proposal-export-namespace-from",
              "@babel/plugin-proposal-numeric-separator",
              "@babel/plugin-proposal-throw-expressions",
              "react-hot-loader/babel"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // 从 JS 中创建样式节点
          },
          {
            loader: 'css-loader', // 转化 CSS 为 CommonJS
          },
          {
            loader: 'less-loader', // 编译 Less 为 CSS
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.(png|jpg|gif|svg|ico|woff|eot|ttf|woff2|icns)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  devServer: {
    host: 'localhost',
    port: 3000,
    compress: true,
    contentBase: '.',
    historyApiFallback: true,
    hot: true,
  }
};
