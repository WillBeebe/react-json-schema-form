const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'ReactJsonSchemaForm',
      type: 'umd',
    },
    globalObject: 'this',
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
    recoil: {
      commonjs: 'recoil',
      commonjs2: 'recoil',
      amd: 'recoil',
      root: 'Recoil',
    },
    '@mui/material': '@mui/material',
    '@mui/icons-material': '@mui/icons-material',
    'react-beautiful-dnd': 'react-beautiful-dnd',
    '@emotion/react': {
      commonjs: '@emotion/react',
      commonjs2: '@emotion/react',
      amd: '@emotion/react',
      root: ['emotionReact'],
    },
    '@emotion/styled': {
      commonjs: '@emotion/styled',
      commonjs2: '@emotion/styled',
      amd: '@emotion/styled',
      root: ['emotionStyled'],
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [new CleanWebpackPlugin()],
  mode: 'production', // Change to 'production' for production builds
};
