const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'JsonSchemaForm',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
    '@mui/material': {
      commonjs: '@mui/material',
      commonjs2: '@mui/material',
      amd: '@mui/material',
      root: 'MuiMaterial',
    },
    '@mui/icons-material': {
      commonjs: '@mui/icons-material',
      commonjs2: '@mui/icons-material',
      amd: '@mui/icons-material',
      root: 'MuiIcons',
    },
    'react-beautiful-dnd': {
      commonjs: 'react-beautiful-dnd',
      commonjs2: 'react-beautiful-dnd',
      amd: 'ReactBeautifulDnd',
      root: 'ReactBeautifulDnd',
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
  mode: 'production',
};
