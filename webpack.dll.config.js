const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: [
      'prop-types',
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react',
      'antd'
    ],
  },
  mode: 'development',
  output: {
    // filename: 'bundle.js',
    filename: 'dll_[name].js',
    library: '[name]_[hash]', // 将此dll包暴露到window上，给app.js调用
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

  plugins: [
    new webpack.DllPlugin({ // DllPlugin的name属性需要和libary保持一致
      name: '[name]_[hash]',
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      context: path.join(__dirname),
    }),
  ],
};
