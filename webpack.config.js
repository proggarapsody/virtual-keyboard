const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
// const isDev = process.env.NODE_ENV === 'development';
// const isProd = !isDev;
const CopyPlugin = require('copy-webpack-plugin');

// const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);
// const filename = (ext) => `[name].${ext}`;

const generateHtmlPlugins = (url) => {
  const files = fs.readdirSync(path.resolve(__dirname, url));
  return files.map((file) => {
    const parts = file.split('.');
    const name = parts[0];
    // const ext = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${url}/${file}`),
    });
  });
};

const htmlPlugins = generateHtmlPlugins('./src/html');

module.exports = {
  entry: { main: path.resolve(__dirname, 'src/index.js') },
  output: {
    filename: 'index.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext][query]',
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,

    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {},
        },
      },
      {
        test: /\.(?:ico|png|gif|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/js/keys.json',
          to: './',
        },
        {
          from: './src/js/phone-keys.json',
          to: './',
        },
      ],
    }),
  ].concat(htmlPlugins),
};
