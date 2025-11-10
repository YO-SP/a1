// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // membersihkan dist sebelum build baru
  },
  module: {
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/public/index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
          globOptions: {
            ignore: ['**/index.html'], // index.html sudah ditangani oleh HtmlWebpackPlugin
          },
        },
        {
          from: path.resolve(__dirname, 'src/public/sw.js'), // pastikan file ini ada di root folder proyek
          to: path.resolve(__dirname, 'dist/'),   // salin ke dist root
        },
      ],
    }),
  ],
};
