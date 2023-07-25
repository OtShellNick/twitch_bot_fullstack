require('dotenv').config({ path: './.env' });

const path = require('path');

const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const FontPreloadPlugin = require('webpack-font-preload-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const { NODE_ENV, CLIENT_ID, REDIRECT_URI, SERVER_URI, CONFIG } = process.env;

console.log('client_id', CLIENT_ID);
const IsDev = NODE_ENV === 'development';

const config = require(path.join(__dirname, `./config/${CONFIG}.json`));

console.log(config);

const filename = ext => (IsDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

const cssLoaders = extra => {
  const loaders = [MiniCssExtractPlugin.loader, 'css-loader'];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = preset => {
  const opts = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  return loaders;
};

const plugins = () => [
  new FaviconsWebpackPlugin({
    logo: path.resolve(__dirname, './src/assets/favicon.png'),
    prefix: 'icons-[fullhash]/',
  }),
  new FontPreloadPlugin({
    loadType: 'preload',
  }),
  new webpack.DefinePlugin({
    CLIENT_ID: `'${CLIENT_ID}'`,
    REDIRECT_URI: `'${config.REDIRECT_URI}'`,
    SERVER_URI: `'${config.SERVER_URI}'`,
    SOCKET_URI: `'${config.SOCKET_URI}'`,
  }),
  new HTMLWebpackPlugin({
    template: './src/index.html',
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: filename('css'),
  }),
];

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.json', '.jsx', '.tsx', '.scss'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@style': path.resolve(__dirname, './src/style'),
      '@containers': path.resolve(__dirname, './src/containers'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@actions': path.resolve(__dirname, './src/actions'),
      '@config': path.resolve(__dirname, './src/config'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
  mode: NODE_ENV || 'production',
  entry: ['@babel/polyfill', path.resolve(__dirname, './src/index.tsx')],
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
    pathinfo: true,
    filename: '[name].[fullhash].js',
    chunkFilename: '[name].[id].[fullhash].js',
  },
  optimization: {
    chunkIds: IsDev ? 'named' : 'deterministic',
    concatenateModules: true,
    innerGraph: true,
    mergeDuplicateChunks: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: false,
          mangle: true,
        },
      }),
    ],
    removeAvailableModules: true,
    removeEmptyChunks: true,
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`,
    },
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        oneOf: [
          {
            resourceQuery: /tsx/,
            use: ['@svgr/webpack'],
          },
          {
            resourceQuery: /jsx/,
            use: ['@svgr/webpack'],
          },
          {
            use: 'url-loader',
          },
        ],
        issuer: /\.[jt]sx?$/,
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[contenthash][ext]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-typescript'),
          },
        ],
      },
      {
        test: /\.jsx$/,
        include: [/sbx-.+/, /src/],
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-react'),
          },
        ],
      },
      {
        test: /\.tsx$/,
        include: [/sbx-.+/, /src/],
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-react'),
          },
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-typescript'),
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8088,
    static: './build',
    historyApiFallback: true,
    compress: true,
  },
  plugins: plugins(),
};
